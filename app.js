const fields=['title','unit','dt','place','recipients','situation','mission','execution','support','command','annexes'];
function val(id){return document.getElementById(id).value.trim()}
function setv(id,v){document.getElementById(id).value=v||''}
function collect(){const o={}; fields.forEach(f=>o[f]=val(f)); return o}
function saveDraft(){localStorage.setItem('diatagesDraft',JSON.stringify(collect())); makeChecklist(); alert('Αποθηκεύτηκε τοπικά.');}
function loadDraft(){const raw=localStorage.getItem('diatagesDraft'); if(!raw){alert('Δεν υπάρχει αποθηκευμένο προσχέδιο.');return;} const o=JSON.parse(raw); fields.forEach(f=>setv(f,o[f])); makePreview();}
function clearForm(){if(confirm('Να καθαριστεί η φόρμα;')){fields.forEach(f=>setv(f,'')); makePreview();}}
function text(){const o=collect(); return `${o.title||'ΔΙΑΤΑΓΗ'}\n\nΜονάδα: ${o.unit}\nΗμερομηνία/Ώρα: ${o.dt}\nΤόπος έκδοσης: ${o.place}\nΑποδέκτες: ${o.recipients}\n\n1. ΚΑΤΑΣΤΑΣΗ\n${o.situation}\n\n2. ΑΠΟΣΤΟΛΗ\n${o.mission}\n\n3. ΕΚΤΕΛΕΣΗ\n${o.execution}\n\n4. ΔΙΟΙΚΗΤΙΚΗ ΜΕΡΙΜΝΑ\n${o.support}\n\n5. ΔΙΟΙΚΗΣΗ ΚΑΙ ΔΙΑΒΙΒΑΣΕΙΣ\n${o.command}\n\nΠΑΡΑΡΤΗΜΑΤΑ / ΣΗΜΕΙΩΣΕΙΣ\n${o.annexes}`;}
function makePreview(){document.getElementById('preview').textContent=text(); makeChecklist();}
function makeChecklist(){const req={title:'Τίτλος',unit:'Μονάδα',dt:'Ημερομηνία/ώρα',situation:'Κατάσταση',mission:'Αποστολή',execution:'Εκτέλεση',support:'Διοικητική μέριμνα',command:'Διοίκηση και διαβιβάσεις'}; document.getElementById('checklist').innerHTML=Object.entries(req).map(([k,n])=>`<div class="${val(k)?'ok':'bad'}">${val(k)?'✓':'✗'} ${n}</div>`).join('');}
function downloadTxt(){makePreview(); const blob=new Blob([text()],{type:'text/plain;charset=utf-8'}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='diatagi.txt'; a.click(); URL.revokeObjectURL(a.href);}
fields.forEach(f=>document.addEventListener('input',e=>{if(e.target.id===f) makeChecklist()}));
window.addEventListener('load',makeChecklist);
