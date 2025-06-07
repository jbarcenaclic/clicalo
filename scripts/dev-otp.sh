#!/bin/bash

echo "📨 Consultando último OTP desde auth.mfa_challenges en Supabase local..."

docker exec -i supabase_db_clicalo psql -U postgres -d postgres -t -A -F"," -c \
"SELECT otp_code, created_at, ip_address FROM auth.mfa_challenges ORDER BY created_at DESC LIMIT 1;" | \
while IFS=',' read -r code created ip; do
  echo ""
  echo "🔐 OTP:     $code"
  echo "🕒 Fecha:   $created"
  echo "🌐 IP:      $ip"
done
