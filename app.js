const KEY='diatages_v4_doc';
let selectedId=null;
const template=[
{id:'pre',num:'',title:'ΠΡΟ ΤΟΥ ΚΕΙΜΕΝΟΥ ΜΕΡΟΣ',text:'',source:'',children:[
 {id:'pre_sec',num:'',title:'Διαβάθμιση ασφαλείας / επείγον',text:'',source:'',children:[]},
 {id:'pre_id',num:'',title:'Ομάδα ταυτότητας / εκδότης / τόπος / χρόνος',text:'',source:'',children:[]},
 {id:'pre_order',num:'',title:'Τύπος και αριθμός διαταγής',text:'ΔΙΑΤΑΓΗ ΕΠΙΧΕΙΡΗΣΕΩΝ ΥΠ’ ΑΡΙΘΜ. …',source:'',children:[]},
 {id:'pre_refs',num:'',title:'ΣΧΕΤΙΚΑ / Χάρτες / Ωρική ζώνη',text:'ΣΧΕΤΙΚΑ:\nΩρική Ζώνη: …',source:'',children:[]}
]},
{id:'main',num:'',title:'ΚΥΡΙΩΣ ΚΕΙΜΕΝΟ',text:'',source:'',children:[
 {id:'p1',num:'1.',title:'ΚΑΤΑΣΤΑΣΗ',text:'',source:'',children:[
  {id:'p1a',num:'α.',title:'Εχθρικές Δυνάμεις',text:'',source:'',children:[{id:'p1a1',num:'(1)',title:'Γενικά',text:'',source:'',children:[]},{id:'p1a2',num:'(2)',title:'Διάταξη / δυνατότητες',text:'',source:'',children:[]}]},
  {id:'p1b',num:'β.',title:'Φίλιες Δυνάμεις',text:'',source:'',children:[{id:'p1b1',num:'(1)',title:'Αποστολή προϊσταμένου κλιμακίου',text:'',source:'',children:[]},{id:'p1b2',num:'(2)',title:'Γειτονικές / υποστηρίζουσες δυνάμεις',text:'',source:'',children:[]}]},
  {id:'p1c',num:'γ.',title:'Περιβάλλον',text:'',source:'',children:[]},
  {id:'p1d',num:'δ.',title:'Προσκολλήσεις - Αποσπάσεις',text:'',source:'',children:[]},
  {id:'p1e',num:'ε.',title:'Προϋποθέσεις',text:'',source:'',children:[]}
 ]},
 {id:'p2',num:'2.',title:'ΑΠΟΣΤΟΛΗ',text:'Ποιος, τι, πότε, πού και γιατί.',source:'',children:[]},
 {id:'p3',num:'3.',title:'ΕΚΤΕΛΕΣΗ',text:'',source:'',children:[
  {id:'p3a',num:'α.',title:'Ιδέα ενεργείας',text:'',source:'',children:[{id:'p3a1',num:'(1)',title:'Πρόθεση Διοικητή',text:'',source:'',children:[]},{id:'p3a2',num:'(2)',title:'Φάσεις / κύρια προσπάθεια',text:'',source:'',children:[]}]},
  {id:'p3b',num:'β.',title:'Αποστολές υφισταμένων',text:'',source:'',children:[]},
  {id:'p3c',num:'γ.',title:'Συντονιστικές οδηγίες',text:'',source:'',children:[]}
 ]},
 {id:'p4',num:'4.',title:'ΔΙΟΙΚΗΤΙΚΗ ΜΕΡΙΜΝΑ',text:'',source:'',children:[{id:'p4a',num:'α.',title:'Προσωπικό',text:'',source:'',children:[]},{id:'p4b',num:'β.',title:'Υλικά / εφόδια / μεταφορές',text:'',source:'',children:[]},{id:'p4c',num:'γ.',title:'Υγειονομική μέριμνα',text:'',source:'',children:[]}]},
 {id:'p5',num:'5.',title:'ΔΙΟΙΚΗΣΗ - ΔΙΑΒΙΒΑΣΕΙΣ',text:'',source:'',children:[{id:'p5a',num:'α.',title:'Διοίκηση / θέσεις διοίκησης',text:'',source:'',children:[]},{id:'p5b',num:'β.',title:'Διαβιβάσεις / συνθηματικά / σήματα',text:'',source:'',children:[]}]}
]},
{id:'post',num:'',title:'ΜΕΤΑ ΤΟ ΚΕΙΜΕΝΟ ΜΕΡΟΣ',text:'',source:'',children:[
 {id:'post_sig',num:'',title:'Υπογραφή / αυθεντικότητα',text:'',source:'',children:[]},
 {id:'post_annex',num:'',title:'Παραρτήματα - Προσθήκες - Πίνακες διανομής',text:'ΠΑΡΑΡΤΗΜΑΤΑ:\nΠΙΝΑΚΑΣ ΔΙΑΝΟΜΗΣ:',source:'',children:[]},
 {id:'post_copy',num:'',title:'Κοινοποιήσεις / επιβεβαίωση λήψης',text:'',source:'',children:[]}
]}
];
let doc=load();
function load(){try{return JSON.parse(localStorage.getItem(KEY))||structuredClone(template)}catch(e){return structuredClone(template)}}
function save(){localStorage.setItem(KEY,JSON.stringify(doc));render();}
function find(nodes,id,parent=null){for(const n of nodes){if(n.id===id)return {n,parent};const r=find(n.children,id,n);if(r)return r}return null}
function esc(s){return (s||'').replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}
function render(){document.getElementById('treeView').innerHTML=renderNodes(doc);renderPreview(); if(selectedId) loadEditor(selectedId,false)}
function renderNodes(nodes){return nodes.map(n=>`<div class="node"><div class="nodeHead ${n.id===selectedId?'selected':''}" onclick="selectNode('${n.id}')"><span class="toggle">${n.children.length?'▾':'•'}</span><span class="num">${esc(n.num)}</span><span class="title">${esc(n.title)}</span><span class="${n.text.trim()?'status':'empty'}">${n.text.trim()?'✓':'λείπει'}</span></div>${n.children.length?renderNodes(n.children):''}</div>`).join('')}
window.selectNode=id=>{selectedId=id;showTab('edit');loadEditor(id,true);render()}
function loadEditor(id,focus){const r=find(doc,id); if(!r)return; document.getElementById('editTitle').textContent=(r.n.num? r.n.num+' ':'')+r.n.title; nodeTitle.value=r.n.title; nodeText.value=r.n.text||''; nodeSource.value=r.n.source||''; if(focus) nodeText.focus()}
function renderPreview(){let out=[];function walk(nodes,level=0){for(const n of nodes){out.push('  '.repeat(level)+(n.num? n.num+' ':'')+n.title); if(n.text) out.push('  '.repeat(level)+n.text); walk(n.children,level+1)}}walk(doc);previewText.textContent=out.join('\n\n')}
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
function showTab(id){document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===id));document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.id===id)); if(id==='preview')renderPreview()}
saveNode.onclick=()=>{if(!selectedId)return;const r=find(doc,selectedId);r.n.title=nodeTitle.value;r.n.text=nodeText.value;r.n.source=nodeSource.value;save()}
addChild.onclick=()=>{if(!selectedId)return;const r=find(doc,selectedId);const id='n'+Date.now();r.n.children.push({id,num:'',title:'Νέο εδάφιο',text:'',source:'',children:[]});save();selectNode(id)}
deleteNode.onclick=()=>{if(!selectedId)return;const r=find(doc,selectedId);if(!r.parent)return alert('Δεν διαγράφεται κύριο μέρος.');r.parent.children=r.parent.children.filter(x=>x.id!==selectedId);selectedId=null;save();showTab('tree')}
analyzeSuperior.onclick=()=>{const t=superiorText.value; if(!t.trim())return; const pairs=[['p1','ΚΑΤΑΣΤΑΣΗ'],['p2','ΑΠΟΣΤΟΛΗ'],['p3','ΕΚΤΕΛΕΣΗ'],['p4','ΔΙΟΙΚΗΤΙΚΗ'],['p5','ΔΙΟΙΚΗΣΗ']]; for(const [id,key] of pairs){const r=find(doc,id); const idx=t.toUpperCase().indexOf(key); if(r&&idx>=0){r.n.source=t.slice(idx,Math.min(t.length,idx+1200)); if(!r.n.text) r.n.text='[Μεταφέρθηκε σχετικό απόσπασμα από τη διαταγή προϊσταμένου – απαιτείται έλεγχος/συμπλήρωση]';}} save(); alert('Ολοκληρώθηκε πρόχειρη αντιστοίχιση. Έλεγξε τις πηγές ανά παράγραφο.');}
saveAll.onclick=save; resetAll.onclick=()=>{if(confirm('Επαναφορά προτύπου;')){doc=structuredClone(template);selectedId=null;save()}}
downloadTxt.onclick=()=>download('diatagi.txt',previewText.textContent,'text/plain');
downloadJson.onclick=()=>download('diatagi.json',JSON.stringify(doc,null,2),'application/json');
loadJson.onchange=e=>{const f=e.target.files[0];if(!f)return;f.text().then(x=>{doc=JSON.parse(x);save()})}
function download(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
if('serviceWorker'in navigator)navigator.serviceWorker.register('./sw.js');render();
