// ================= Dark/Light Mode =================
const toggleBtn = document.getElementById('toggleMode');
toggleBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('section').forEach(sec=>sec.classList.toggle('dark-mode'));
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');
});

// ================= TASBIH COUNTER =================
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

// ================= ZAKAT CALCULATOR =================
document.getElementById('calcZakat').addEventListener('click', () => {
    const cash = parseFloat(document.getElementById('cash').value)||0;
    const gold = parseFloat(document.getElementById('gold').value)||0;
    const silver = parseFloat(document.getElementById('silver').value)||0;
    const goldRate = parseFloat(document.getElementById('goldRate').value)||0;
    const silverRate = parseFloat(document.getElementById('silverRate').value)||0;
    const totalWealth = cash + gold*goldRate + silver*silverRate;
    const zakat = totalWealth*0.025;
    document.getElementById('zakatResult').textContent = zakat.toFixed(2);
});

// ================= HIJRI CALENDAR =================
const hijriDateEl = document.getElementById('hijriDate');
function updateHijri(){
    hijriDateEl.textContent = new Intl.DateTimeFormat('en-TN-u-ca-islamic',{
        day:'numeric', month:'long', year:'numeric'
    }).format(new Date());
}
updateHijri();

// ================= DAILY PRAYER TRACKER =================
const checkboxes = document.querySelectorAll('#prayerTracker input[type="checkbox"]');
const prayersCompletedEl = document.getElementById('prayersCompleted');
checkboxes.forEach(box=>box.addEventListener('change', updatePrayerCount));
function updatePrayerCount(){
    const completed = Array.from(checkboxes).filter(cb=>cb.checked).length;
    prayersCompletedEl.textContent = completed;
}

// ================= PRAYER TIMINGS =================
async function getNamazTimings(){
    try{
        const {data} = await axios.get('https://api.aladhan.com/v1/timingsByCity',{
            params:{city:'Bangalore', country:'India', method:2}
        });
        const timings = data.data.timings;
        const filteredTimings = {Fajr:timings.Fajr, Sunrise:timings.Sunrise, Dhuhr:timings.Dhuhr, Asr:timings.Asr, Maghrib:timings.Maghrib, Isha:timings.Isha};
        const timingsEl = document.getElementById('timings');
        const now = new Date();
        let nextPrayerName='', nextPrayerTime=null;
        timingsEl.innerHTML = Object.entries(filteredTimings).map(([name,time])=>{
            const [h,m] = time.split(':').map(Number);
            const pTime = new Date(); pTime.setHours(h,m,0,0);
            if(!nextPrayerTime && pTime>now){nextPrayerTime=pTime; nextPrayerName=name;}
            return `<p class="${name===nextPrayerName?'next-prayer':''}"><strong>${name}</strong>: ${time}</p>`;
        }).join('');
        if(nextPrayerTime){
            const timerEl = document.getElementById('next-prayer-timer');
            function updateTimer(){
                const diff = nextPrayerTime - new Date();
                const hours = Math.floor(diff/(1000*60*60));
                const minutes = Math.floor((diff%(1000*60*60))/(1000*60));
                const seconds = Math.floor((diff%(1000*60))/1000);
                timerEl.textContent = `Next prayer: ${nextPrayerName} in ${hours}h ${minutes}m ${seconds}s`;
            }
            setInterval(updateTimer,1000); updateTimer();
        }
    }catch(err){console.error('Error fetching timings',err);}
}
getNamazTimings();

// ================= QIBLA COMPASS =================
const canvas = document.getElementById('qiblaCanvas');
const ctx = canvas.getContext('2d');
let qiblaAngle=0;

function drawCompass(angle){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // outer circle
    ctx.beginPath(); ctx.arc(150,150,120,0,2*Math.PI); ctx.strokeStyle='#f39f86'; ctx.lineWidth=4; ctx.stroke();
    // directions N E S W
    ctx.fillStyle = '#f39f86'; ctx.font='16px Arial';
    ctx.fillText('N',145,30); ctx.fillText('E',270,155); ctx.fillText('S',145,280); ctx.fillText('W',20,155);
    // arrow
    ctx.save(); ctx.translate(150,150); ctx.rotate(angle*Math.PI/180);
    ctx.beginPath(); ctx.moveTo(0,-100); ctx.lineTo(-12,-80); ctx.lineTo(12,-80); ctx.closePath();
    ctx.fillStyle='#d95c5c'; ctx.fill(); ctx.restore();
}

// Calculate Qibla Angle
navigator.geolocation.getCurrentPosition(pos=>{
    const lat = pos.coords.latitude*Math.PI/180;
    const lon = pos.coords.longitude*Math.PI/180;
    const kaabaLat=21.4225*Math.PI/180;
    const kaabaLon=39.8262*Math.PI/180;
    const angle = Math.atan2(Math.sin(kaabaLon-lon)*Math.cos(kaabaLat),
        Math.cos(lat)*Math.sin(kaabaLat)-Math.sin(lat)*Math.cos(kaabaLat)*Math.cos(kaabaLon-lon));
    qiblaAngle=angle*180/Math.PI; drawCompass(qiblaAngle);
});

// Device Orientation
if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation', (event)=>{
        const alpha = event.alpha||0;
        drawCompass(qiblaAngle-alpha);
    }, true);
}

// ================= QUOTE OF THE DAY =================
const quotes = [
    "Indeed, Allah is with the patient.",
    "Perform prayer at the decline of the sun.",
    "Give charity without delay.",
    "Remember Allah and you will find peace."
];
document.getElementById('quoteText').textContent = quotes[Math.floor(Math.random()*quotes.length)];
