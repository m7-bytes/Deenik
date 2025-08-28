// ====================== TASBIH ======================
let count = 0;
const tasbihCount = document.getElementById('tasbihCount');
document.getElementById('tasbihBtn').addEventListener('click', () => {
    count++;
    tasbihCount.textContent = count;
});
document.getElementById('resetTasbih').addEventListener('click', () => {
    count = 0;
    tasbihCount.textContent = count;
});

// ====================== ZAKAT ======================
document.getElementById('calcZakat').addEventListener('click', () => {
    const cash = parseFloat(document.getElementById('cash').value) || 0;
    const gold = parseFloat(document.getElementById('gold').value) || 0;
    const silver = parseFloat(document.getElementById('silver').value) || 0;
    const goldRate = parseFloat(document.getElementById('goldRate').value) || 0;
    const silverRate = parseFloat(document.getElementById('silverRate').value) || 0;

    const totalWealth = cash + (gold * goldRate) + (silver * silverRate);
    const zakat = totalWealth * 0.025;
    document.getElementById('zakatResult').textContent = zakat.toFixed(2);
});

// ====================== NAMAZ TIMINGS ======================
async function getNamazTimings() {
    try {
        const { data } = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
            params: { city: 'Bangalore', country: 'India', method: 2 }
        });

        const timings = data.data.timings;
        const filteredTimings = {
            Fajr: timings.Fajr,
            Dhuhr: timings.Dhuhr,
            Asr: timings.Asr,
            Maghrib: timings.Maghrib,
            Isha: timings.Isha,
            Sunrise: timings.Sunrise
        };

        const timingsEl = document.getElementById('timings');
        timingsEl.innerHTML = Object.entries(filteredTimings)
            .map(([name, time]) => `<p>${name}: ${time}</p>`)
            .join('');

        // Next Prayer Countdown
        const now = new Date();
        const nextPrayer = Object.entries(filteredTimings).map(([name, time]) => {
            const [hour, minute] = time.split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(hour, minute, 0, 0);
            if (prayerTime > now) return { name, prayerTime };
        }).filter(Boolean)[0];

        if (nextPrayer) {
            const timerEl = document.getElementById('next-prayer-timer');
            function updateTimer() {
                const diff = nextPrayer.prayerTime - new Date();
                const hours = Math.floor(diff / (1000*60*60));
                const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
                const seconds = Math.floor((diff % (1000*60)) / 1000);
                timerEl.textContent = `Next prayer: ${nextPrayer.name} in ${hours}h ${minutes}m ${seconds}s`;
            }
            setInterval(updateTimer, 1000);
            updateTimer();
        }

    } catch(err) {
        console.error('Error fetching timings', err);
    }
}
getNamazTimings();

// ====================== QIBLA COMPASS ======================
const canvas = document.getElementById('qiblaCanvas');
const ctx = canvas.getContext('2d');

function drawCompass(angle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Outer circle
    ctx.beginPath();
    ctx.arc(125, 125, 100, 0, 2*Math.PI);
    ctx.strokeStyle = '#f39f86';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Arrow
    ctx.save();
    ctx.translate(125, 125);
    ctx.rotate(angle * Math.PI / 180);
    ctx.beginPath();
    ctx.moveTo(0, -80);
    ctx.lineTo(-12, -60);
    ctx.lineTo(12, -60);
    ctx.closePath();
    ctx.fillStyle = '#f39f86';
    ctx.fill();
    ctx.restore();
}

// Device Orientation for smooth rotation
if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', (event) => {
        const alpha = event.alpha; // rotation around z-axis
        const kaabaLat = 21.4225;
        const kaabaLon = 39.8262;

        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const angleToKaaba = Math.atan2(
                Math.sin(kaabaLon-lon)*Math.cos(kaabaLat),
                Math.cos(lat)*Math.sin(kaabaLat) - Math.sin(lat)*Math.cos(kaabaLat)*Math.cos(kaabaLon-lon)
            ) * (180/Math.PI);
            const rotation = angleToKaaba - alpha;
            drawCompass(rotation);
        });
    }, true);
}
