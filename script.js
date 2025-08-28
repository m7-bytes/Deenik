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
document.getElementById('tasbihBtn').addEventListener('click',()=>{
    count++;
    tasbihCount.textContent=count;
    tasbihCount.style.transform='scale(1.2)';
    setTimeout(()=>tasbihCount.style.transform='scale(1)',150);
});
document.getElementById('resetTasbih').addEventListener('click',()=>{
    count=0;
    tasbihCount.textContent=count;
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
    const
