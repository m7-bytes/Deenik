// Tasbih Counter
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

// Zakat Calculator (2.5%)
document.getElementById('calcZakat').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('zakatAmount').value);
    const zakat = amount * 0.025 || 0;
    document.getElementById('zakatResult').textContent = zakat.toFixed(2);
});

// Hijri Calendar using Intl API
const hijriDateEl = document.getElementById('hijriDate');
const hijriDate = new Intl.DateTimeFormat('en-TN-u-ca-islamic', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
hijriDateEl.textContent = hijriDate;

// Namaz Timings & Next Prayer (using API)
async function getNamazTimings() {
    try {
        const { data } = await axios.get('https://api.aladhan.com/v1/timingsByCity', {
            params: { city: 'Bangalore', country: 'India', method: 2 }
        });

        const timings = data.data.timings;
        const timingsEl = document.getElementById('timings');
        timingsEl.innerHTML = Object.entries(timings)
            .map(([name, time]) => `<p>${name}: ${time}</p>`)
            .join('');

        // Next prayer countdown
        const now = new Date();
        const nextPrayer = Object.entries(timings).map(([name, time]) => {
            const [hour, minute] = time.split(':').map(Number);
            const prayerTime = new Date();
            prayerTime.setHours(hour, minute, 0, 0);
            if (prayerTime > now) return { name, prayerTime };
        }).filter(Boolean)[0];

        if(nextPrayer){
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

// Qibla Compass
function drawCompass(angle) {
    const canvas = document.getElementById('qiblaCanvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(100, 100, 90, 0, 2*Math.PI);
    ctx.stroke();

    // Arrow
    ctx.save();
    ctx.translate(100, 100);
    ctx.rotate((angle-90)*Math.PI/180); // rotate arrow
    ctx.beginPath();
    ctx.moveTo(0, -70);
    ctx.lineTo(-10, -50);
    ctx.lineTo(10, -50);
    ctx.closePath();
    ctx.fillStyle = '#d95c5c';
    ctx.fill();
    ctx.restore();
}

// Get Qibla direction using geolocation
navigator.geolocation.getCurrentPosition(position => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;
    const angle = Math.atan2(
        Math.sin(kaabaLon-lon)*Math.cos(kaabaLat),
        Math.cos(lat)*Math.sin(kaabaLat) - Math.sin(lat)*Math.cos(kaabaLat)*Math.cos(kaabaLon-lon)
    ) * (180/Math.PI);
    drawCompass(angle);
});
