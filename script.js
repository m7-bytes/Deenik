// Dark/Light Mode
const toggleBtn=document.getElementById('toggleMode');
toggleBtn.addEventListener('click',()=>{
    document.body.classList.toggle('dark-mode');
    document.querySelectorAll('.card').forEach(c=>c.classList.toggle('dark-mode'));
    document.querySelector('header').classList.toggle('dark-mode');
    document.querySelector('footer').classList.toggle('dark-mode');
});

// Tasbih Counter
let count=0;
const tasbihCount=document.getElementById('tasbihCount');
function formatCount(n){return n.toString().padStart(4,'0');}
document.getElementById('tasbihBtn').addEventListener('click',()=>{
    count++; tasbihCount.textContent=formatCount(count);
});
document.getElementById('resetTasbih').addEventListener('click',()=>{
    count=0; tasbihCount.textContent=formatCount(count);
});

// Zakat Calculator
document.getElementById('calcZakat').addEventListener('click',()=>{
    const cash=parseFloat(document.getElementById('cash').value)||0;
    const gold=parseFloat(document.getElementById('gold').value)||0;
    const silver=parseFloat(document.getElementById('silver').value)||0;
    const goldRate=parseFloat(document.getElementById('goldRate').value)||0;
    const silverRate=parseFloat(document.getElementById('silverRate').value)||0;
    const total=cash+gold*goldRate+silver*silverRate;
    const zakat=total*0.025;
    const resultEl=document.getElementById('zakatResult');
    resultEl.textContent=zakat.toFixed(2);
    resultEl.style.color='#FFD700';
});

// Hijri Calendar
const hijriDateEl=document.getElementById('hijriDate');
function updateHijri(){
    hijriDateEl.textContent=new Intl.DateTimeFormat('en-TN-u-ca-islamic',{
        day:'numeric',month:'long',year:'numeric'
    }).format(new Date());
}
updateHijri();

// Daily Prayer Tracker
const checkboxes=document.querySelectorAll('#prayerTracker input[type="checkbox"]');
const prayersCompletedEl=document.getElementById('prayersCompleted');
function updatePrayerCount(){
    let completed=0;
    checkboxes.forEach(cb=>{if(cb.checked) completed++;});
    prayersCompletedEl.textContent=completed;
    const ring=document.querySelector('.ring');
    const offset=314 - (314*(completed/5));
    ring.style.strokeDashoffset=offset;
}
checkboxes.forEach(cb=>cb.addEventListener('change',updatePrayerCount));
updatePrayerCount();

// Prayer Duas
const prayerDuas = {
    Fajr: "اللَّهُمَّ اجعلنا من الفائزين بصلاتنا وتقبلها منا. / O Allah, make us among those who attain success through our prayers and accept them from us.",
    Dhuhr: "اللَّهُمَّ اجعلنا من الشاكرين لنعمك وواهبينا الهداية. / O Allah, make us among those who are grateful for Your blessings and grant us guidance.",
    Asr: "اللَّهُمَّ اجعلنا من المتقين واغفر لنا ذنوبنا. / O Allah, make us among the pious and forgive our sins.",
    Maghrib: "سبحانك اللهم وبحمدك / Glory be to You, O Allah, and praise.",
    Isha: "اللَّهُمَّ اجعلنا من الذاكرين لك دائمًا. / O Allah, make us always among those who remember You."
};
const duaText=document.getElementById('duaText');
checkboxes.forEach(cb=>{
    cb.addEventListener('change',()=>{
        if(cb.checked) duaText.textContent = prayerDuas[cb.id.replace('Check','')] || "Dua not found.";
    });
});

// Quote of the Day
const quoteText=document.getElementById('quoteText');
const quotes=[
  { ur:"اللہ کو یاد رکھو، تمہیں سکون ملے گا۔", en:"Remember Allah in your heart, and you will find peace." },
  { ur:"نماز جنت کی چابی ہے۔", en:"Prayer is the key to Paradise." },
  { ur:"اللہ کسی روح پر اس کی طاقت سے زیادہ بوجھ نہیں ڈالتا۔", en:"Allah does not burden a soul beyond that it can bear." },
  { ur:"نیک اعمال برے اعمال کو مٹا دیتے ہیں۔", en:"Good deeds erase bad deeds." }
];
function updateQuote(){
    const q = quotes[Math.floor(Math.random()*quotes.length)];
    quoteText.style.opacity=0;
    setTimeout(()=>{quoteText.innerHTML=`${q.ur}<br><em>${q.en}</em>`; quoteText.style.opacity=1;},300);
}
updateQuote();
setInterval(updateQuote,86400000);

// Prayer Timings
function updatePrayerTimes(){
    if(!navigator.geolocation){console.log("Geolocation not supported");return;}
    navigator.geolocation.getCurrentPosition(pos=>{
        const lat=pos.coords.latitude, lon=pos.coords.longitude;
        axios.get(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lon}&method=2`)
        .then(res=>{
            const timings=res.data.data.timings;
            const container=document.getElementById('timings');
            container.innerHTML="";
            let nextPrayer="", now=new Date();
            let nextTimeDiff=86400000;
            for(let [name,time] of Object.entries(timings)){
                if(["Fajr","Dhuhr","Asr","Maghrib","Isha"].includes(name)){
                    const [h,m]=time.split(":");
                    let t=new Date(); t.setHours(h,m,0,0);
                    let diff=t-now;
                    if(diff>0 && diff<nextTimeDiff){nextTimeDiff=diff; nextPrayer=name;}
                    const p=document.createElement('p'); p.textContent=`${name}: ${time}`;
                    if(name===nextPrayer)p.classList.add('next-prayer');
                    container.appendChild(p);
                }
            }
            document.getElementById('next-prayer-timer').textContent=`Next: ${nextPrayer} in ${Math.floor(nextTimeDiff/60000)} mins`;
        });
    });
}
updatePrayerTimes();
setInterval(updatePrayerTimes,60000);

// Qibla Compass
const canvas=document.getElementById('qiblaCanvas');
const ctx=canvas.getContext('2d');
function drawCompass(a){
    ctx.clearRect(0,0,300,300);
    ctx.beginPath(); ctx.arc(150,150,100,0,2*Math.PI); ctx.strokeStyle="#f39f86"; ctx.lineWidth=5; ctx.stroke();
    ctx.save(); ctx.translate(150,150); ctx.rotate(a);
    ctx.beginPath(); ctx.moveTo(0,-90); ctx.lineTo(0,0); ctx.strokeStyle="#FFD700"; ctx.lineWidth=6; ctx.stroke();
    ctx.restore();
}
if(window.DeviceOrientationEvent){
    window.addEventListener('deviceorientation',e=>{
        const angle=((e.alpha||0)*Math.PI/180);
        drawCompass(angle);
    });
}else{drawCompass(0);}
