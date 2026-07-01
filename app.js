const STORAGE_KEY='diatages_machis_v3';
let selectedId=null;
let state={meta:{}, nodes:[]};

function uid(){return Math.random().toString(36).slice(2,10)}
function baseTemplate(){
  const n=(title, children=[])=>({id:uid(),title,text:'',source:'',open:true,children});
  return [
    n('1. ΚΑΤΑΣΤΑΣΗ',[n('α. Εχθρικές Δυνάμεις',[n('(1) Γενικά'),n('(2) Διάταξη'),n('(3) Δυνατότητες')]),n('β. Φίλιες Δυνάμεις',[n('(1) Αποστολή ανώτερου κλιμακίου'),n('(2) Αποστολές γειτονικών/συνεργαζόμενων')]),n('γ. Περιβάλλον'),n('δ. Προσκολλήσεις - Αποσπάσεις'),n('ε. Προϋποθέσεις')]),
    n('2. ΑΠΟΣΤΟΛΗ',[n('α. Αποστολή ανώτερου κλιμακίου'),n('β. Αποστολή δικού μας κλιμακίου')]),
    n('3. ΕΚΤΕΛΕΣΗ',[n('α. Πρόθεση Διοικητή'),n('β. Ιδέα ενεργείας',[n('(1) Γενικά'),n('(2) Φάσεις')]),n('γ. Αποστολές υφισταμένων'),n('δ. Συντονιστικές οδηγίες')]),
    n('4. ΔΙΟΙΚΗΤΙΚΗ ΜΕΡΙΜΝΑ',[n('α. Προσωπικό'),n('β. Υλικά - μέσα'),n('γ. Υγειονομικά'),n('δ. Μεταφορές')]),
    n('5. ΔΙΟΙΚΗΣΗ - ΔΙΑΒΙΒΑΣΕΙΣ',[n('α. Διοίκηση'),n('β. Διαβιβάσεις'),n('γ. Αναφορές - σήματα')])
  ];
}
function init(){state.nodes=baseTemplate();selectedId=state.nodes[0].id;bind();renderAll();}
function bind(){
 ['unit','higher','doctype','docno','dtg','tz'].forEach(id=>document.getElementById(id).addEventListener('input',()=>{state.meta[id]=document.getElementById(id).value;renderAll(false)}));
 document.getElementById('nodeTitle').addEventListener('input',()=>{let x=find(selectedId); if(x){x.title=event.target.value;renderAll(false)}});
 document.getElementById('nodeText').addEventListener('input',()=>{let x=find(selectedId); if(x){x.text=event.target.value;renderAll(false)}});
 document.getElementById('nodeSource').addEventListener('input',()=>{let x=find(selectedId); if(x){x.source=event.target.value;renderAll(false)}});
 document.getElementById('saveBtn').onclick=()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));alert('Αποθηκεύτηκε στη συσκευή')};
 document.getElementById('loadBtn').onclick=()=>{let s=localStorage.getItem(STORAGE_KEY); if(s){state=JSON.parse(s);selectedId=state.nodes[0]?.id;loadMeta();renderAll()}else alert('Δεν βρέθηκε αποθήκευση')};
 document.getElementById('clearBtn').onclick=()=>{if(confirm('Καθαρισμός όλων;')){localStorage.removeItem(STORAGE_KEY);state={meta:{},nodes:baseTemplate()};selectedId=state.nodes[0].id;loadMeta();renderAll()}};
 document.getElementById('addChildBtn').onclick=addChild;
 document.getElementById('deleteNodeBtn').onclick=deleteNode;
 document.getElementById('exportTxtBtn').onclick=()=>download('diatagi.txt',buildText(),'text/plain');
 document.getElementById('exportJsonBtn').onclick=()=>download('diatagi.json',JSON.stringify(state,null,2),'application/json');
 document.getElementById('importJson').onchange=importJson;
}
function loadMeta(){['unit','higher','doctype','docno','dtg','tz'].forEach(id=>document.getElementById(id).value=state.meta[id]||'')}
function find(id,nodes=state.nodes){for(const x of nodes){if(x.id===id)return x;let y=find(id,x.children||[]);if(y)return y}return null}
function findParent(id,nodes=state.nodes,parent=null){for(const x of nodes){if(x.id===id)return parent;let y=findParent(id,x.children||[],x);if(y)return y}return null}
function renderAll(updateEditor=true){renderTree(); if(updateEditor) renderEditor(); renderChecks(); renderPreview();}
function renderTree(){const root=document.getElementById('tree');root.innerHTML='';state.nodes.forEach(x=>root.appendChild(nodeEl(x,0)));}
function nodeEl(x,level){const wrap=document.createElement('div');wrap.className='node';const row=document.createElement('div');row.className='nodeRow'+(x.id===selectedId?' active':'');
 const tog=document.createElement('span');tog.className='toggle';tog.textContent=(x.children?.length)?(x.open?'▾':'▸'):'';tog.onclick=()=>{x.open=!x.open;renderTree()};
 const lab=document.createElement('span');lab.className='nodeLabel';lab.textContent=x.title;lab.onclick=()=>{selectedId=x.id;renderAll()};
 const st=document.createElement('span');st.className='status '+(x.text.trim()?'filled':'empty');st.textContent=x.text.trim()?'✓':'λείπει';
 row.append(tog,lab,st);wrap.appendChild(row); if(x.open && x.children) x.children.forEach(c=>wrap.appendChild(nodeEl(c,level+1))); return wrap;}
function renderEditor(){const x=find(selectedId); if(!x)return;document.getElementById('editTitle').textContent=x.title;document.getElementById('nodeTitle').value=x.title;document.getElementById('nodeText').value=x.text;document.getElementById('nodeSource').value=x.source;}
function renderChecks(){const out=[];const walk=(x)=>{if(!x.text.trim() && (!x.children||x.children.length===0))out.push('Λείπει περιεχόμενο: '+x.title);(x.children||[]).forEach(walk)};state.nodes.forEach(walk);document.getElementById('checks').innerHTML=out.length?out.map(s=>`<div class="checkItem warn">⚠ ${s}</div>`).join(''):'<div class="checkItem ok">✓ Δεν εντοπίστηκαν κενά τελικά εδάφια.</div>';}
function buildText(){let m=state.meta;let lines=[];lines.push((m.doctype||'ΔΙΑΤΑΓΗ ΕΠΙΧΕΙΡΗΣΕΩΝ')+' '+(m.docno||''));lines.push('Μονάδα: '+(m.unit||''));lines.push('Προϊστάμενο κλιμάκιο: '+(m.higher||''));lines.push('Ημερομηνία/ώρα: '+(m.dtg||''));lines.push('Ωρική ζώνη: '+(m.tz||''));lines.push('');const walk=(x,depth=0)=>{lines.push('  '.repeat(depth)+x.title); if(x.text.trim())lines.push('  '.repeat(depth)+x.text.trim()); (x.children||[]).forEach(c=>walk(c,depth+1));};state.nodes.forEach(x=>walk(x));return lines.join('\n');}
function renderPreview(){document.getElementById('preview').textContent=buildText();}
function addChild(){const x=find(selectedId); if(!x)return; x.children=x.children||[];const child={id:uid(),title:'Νέο εδάφιο',text:'',source:'',open:true,children:[]};x.children.push(child);x.open=true;selectedId=child.id;renderAll();}
function deleteNode(){if(!selectedId)return; if(state.nodes.some(x=>x.id===selectedId)){alert('Δεν διαγράφεται κύρια παράγραφος.');return;}const p=findParent(selectedId); if(!p)return; p.children=p.children.filter(c=>c.id!==selectedId);selectedId=p.id;renderAll();}
function download(name,content,type){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([content],{type}));a.download=name;a.click();URL.revokeObjectURL(a.href)}
function importJson(e){const f=e.target.files[0]; if(!f)return; const r=new FileReader();r.onload=()=>{try{state=JSON.parse(r.result);selectedId=state.nodes[0]?.id;loadMeta();renderAll()}catch(err){alert('Μη έγκυρο JSON')}};r.readAsText(f)}
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').catch(()=>{});}init();
