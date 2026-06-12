#!/bin/bash
# =====================================================================
# SETUP VPS FROM SCRATCH — Padrão Imperatriz
# =====================================================================
# Roda esse script numa VPS Ubuntu/Debian nova e ela fica pronta pra
# receber apps Imperatriz.
#
# Uso: bash setup-vps-from-scratch.sh
# =====================================================================

set -euo pipefail

echo "🚀 Setup VPS Imperatriz iniciando..."

# ============== 1. ATUALIZA SISTEMA ============
echo "📦 Atualizando sistema..."
apt-get update -y
apt-get upgrade -y

# ============== 2. FERRAMENTAS BASICAS ============
echo "🔧 Instalando ferramentas..."
apt-get install -y \
  curl \
  wget \
  git \
  vim \
  htop \
  ufw \
  fail2ban \
  unattended-upgrades \
  jq \
  certbot \
  python3-certbot-nginx

# ============== 3. FIREWALL ============
echo "🔥 Configurando firewall..."
ufw default deny incoming
ufw default allow outgoing
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# ============== 4. DOCKER ============
if ! command -v docker &> /dev/null; then
  echo "🐳 Instalando Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker
  systemctl start docker
fi

# Docker Compose plugin (vem com Docker novo)
docker compose version

# ============== 5. NGINX ============
if ! command -v nginx &> /dev/null; then
  echo "🌐 Instalando Nginx..."
  apt-get install -y nginx
  systemctl enable nginx
fi

# ============== 6. ESTRUTURA DE PASTAS ============
echo "📁 Criando estrutura..."
mkdir -p /opt/imperatriz/{apps,backups,scripts,nginx-snippets}
mkdir -p /var/log/imperatriz

# ============== 7. NGINX SNIPPETS ============
echo "📝 Copiando snippets do Nginx..."
# Copie os arquivos manualmente OU clone do repo:
# git clone https://github.com/tatagoncalvesof/imperatriz-vps-config.git /tmp/cfg
# cp /tmp/cfg/nginx-snippets/* /etc/nginx/snippets/

# ============== 8. AUTO-UPDATE DE SEGURANÇA ============
echo "🔒 Habilitando auto-update de seguranca..."
dpkg-reconfigure -plow unattended-upgrades

# ============== 9. SWAP (se faltar) ============
if [ ! -f /swapfile ]; then
  echo "💾 Criando swap de 2GB..."
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

# ============== 10. CRON DE BACKUP ============
echo "💾 Configurando backup diario..."
cat > /opt/imperatriz/scripts/backup-postgres.sh <<'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d-%H%M%S)
docker exec imperatriz-postgres-1 pg_dumpall -U imperatriz | gzip > /opt/imperatriz/backups/postgres-$DATE.sql.gz
# Mantem so ultimos 14 dias
find /opt/imperatriz/backups -name "postgres-*.sql.gz" -mtime +14 -delete
EOF
chmod +x /opt/imperatriz/scripts/backup-postgres.sh

# Adiciona ao cron (3h da manha todo dia)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/imperatriz/scripts/backup-postgres.sh") | crontab -

# ============== 11. SSH HARDENING ============
echo "🔐 Endurecendo SSH..."
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
systemctl restart ssh

echo ""
echo "✅ Setup completo!"
echo ""
echo "PROXIMOS PASSOS MANUAIS:"
echo "1. Subir docker-compose.yml em /opt/imperatriz/"
echo "2. Configurar /etc/nginx/sites-available/ com edge-layer.conf"
echo "3. Rodar 'certbot --nginx' pra SSL de cada dominio"
echo "4. Testar: curl https://seu-app.com/health"
echo ""
