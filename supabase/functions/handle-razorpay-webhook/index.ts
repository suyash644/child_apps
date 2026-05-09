// Edge Function: handle-razorpay-webhook
// Receives payment events from Razorpay, verifies the HMAC signature,
// and updates the subscriptions table. This is the only code path that
// writes to subscriptions — clients never write it directly (ADR 014).
//
// Required environment variables:
//   RAZORPAY_WEBHOOK_SECRET  — from Razorpay dashboard → Webhooks
//   SUPABASE_URL             — auto-injected
//   SUPABASE_SERVICE_ROLE_KEY — auto-injected

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Maps Razorpay plan IDs (set in Razorpay dashboard) to our subscription_plan enum values.
// Update these when you create the plans in Razorpay.
const PLAN_MAP: Record<string, string> = {
  'plan_premium_monthly': 'premium_monthly',
  'plan_premium_yearly':  'premium_yearly',
  'plan_lifetime':        'lifetime',
}

async function verifySignature(body: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const mac = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const expected = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
  return expected === signature
}

serve(async (req) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const rawBody = await req.text()
  const signature = req.headers.get('x-razorpay-signature') ?? ''
  const secret = Deno.env.get('RAZORPAY_WEBHOOK_SECRET')

  if (!secret) return new Response('Webhook secret not configured', { status: 500 })

  // Always verify before processing — reject tampered requests
  const valid = await verifySignature(rawBody, signature, secret)
  if (!valid) return new Response('Invalid signature', { status: 401 })

  const event = JSON.parse(rawBody)
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  const eventType: string = event.event

  // ── payment.captured ─────────────────────────────────────────────────────────
  // Fires for one-time payments (lifetime plan, or first payment of a subscription)
  if (eventType === 'payment.captured') {
    const payment = event.payload.payment.entity
    const notes = payment.notes ?? {}

    // `notes.profile_id` must be set when creating the Razorpay order from the mobile app
    const profileId: string = notes.profile_id
    const planKey: string = notes.plan_key ?? 'lifetime'
    const plan = PLAN_MAP[planKey] ?? 'lifetime'

    if (!profileId) {
      console.error('payment.captured: missing notes.profile_id', payment.id)
      return new Response('Missing profile_id in payment notes', { status: 422 })
    }

    const expiresAt = plan === 'lifetime'
      ? null
      : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

    await supabase.from('subscriptions').upsert({
      profile_id: profileId,
      plan,
      status: 'active',
      started_at: new Date().toISOString(),
      expires_at: expiresAt,
      razorpay_payment_id: payment.id,
    }, { onConflict: 'profile_id' })
  }

  // ── subscription.activated ───────────────────────────────────────────────────
  // Fires when a Razorpay subscription (recurring) goes live
  else if (eventType === 'subscription.activated') {
    const sub = event.payload.subscription.entity
    const profileId: string = sub.notes?.profile_id

    if (!profileId) {
      console.error('subscription.activated: missing notes.profile_id', sub.id)
      return new Response('Missing profile_id', { status: 422 })
    }

    const plan = PLAN_MAP[sub.plan_id] ?? 'premium_monthly'
    const expiresAt = sub.current_end
      ? new Date(sub.current_end * 1000).toISOString()
      : null

    await supabase.from('subscriptions').upsert({
      profile_id: profileId,
      plan,
      status: 'active',
      started_at: new Date().toISOString(),
      expires_at: expiresAt,
      razorpay_subscription_id: sub.id,
    }, { onConflict: 'profile_id' })
  }

  // ── subscription.charged ─────────────────────────────────────────────────────
  // Fires on each renewal — extend the expiry date
  else if (eventType === 'subscription.charged') {
    const sub = event.payload.subscription.entity
    const expiresAt = sub.current_end
      ? new Date(sub.current_end * 1000).toISOString()
      : null

    await supabase
      .from('subscriptions')
      .update({ status: 'active', expires_at: expiresAt })
      .eq('razorpay_subscription_id', sub.id)
  }

  // ── subscription.cancelled ───────────────────────────────────────────────────
  // User cancelled; keep access until period end (expires_at already set above)
  else if (eventType === 'subscription.cancelled') {
    const sub = event.payload.subscription.entity
    await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('razorpay_subscription_id', sub.id)
  }

  // ── subscription.completed / payment.failed ───────────────────────────────────
  else if (eventType === 'subscription.completed' || eventType === 'payment.failed') {
    const sub = event.payload.subscription?.entity ?? event.payload.payment?.entity
    const field = sub?.id
      ? { razorpay_subscription_id: sub.id }
      : { razorpay_payment_id: sub?.id }

    if (field) {
      await supabase
        .from('subscriptions')
        .update({ status: 'expired' })
        .match(field)
    }
  }

  // Acknowledge all recognised events to prevent Razorpay retries
  return new Response(JSON.stringify({ received: true, event: eventType }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
})
