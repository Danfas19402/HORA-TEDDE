const KEY='hora_tedde_registros', THEME='hora_tedde_tema';
let registros=JSON.parse(localStorage.getItem(KEY)||'[]');

const $=id=>document.getElementById(id);
function min(t){if(!t)return null;const [h,m]=t.split(':').map(Number);return h*60+m}
function fmt(n){n=Math.max(0,n);return String(Math.floor(n/60)).padStart(2,'0')+':'+String(n%60).padStart(2,'0')}
function salvar(){localStorage.setItem(KEY,JSON.stringify(registros));render()}
function render(){
  $('tabela').innerHTML=registros.map((r,i)=>`<tr>
    <td>${r.data}</td><td>${r.entrada||'—'}</td><td>${r.ai||'—'}</td><td>${r.af||'—'}</td>
    <td>${r.saida||'—'}</td><td>${r.folga?'Folga':fmt(r.trabalhadas)}</td><td>${r.folga?'—':fmt(r.extra)}</td>
    <td><button class="remove" onclick="remover(${i})">✖</button></td>
  </tr>`).join('');
}
function adicionar(folga=false){
  const data=$('data').value;if(!data){alert('Informe a data.');return}
  if(folga){registros.push({data,folga:true});salvar();return}
  const e=$('entrada').value, ai=$('almocoInicio').value, af=$('almocoFim').value, s=$('saida').value;
  if(!e||!ai||!af||!s){alert('Preencha todos os horários.');return}
  const trabalhadas=(min(ai)-min(e))+(min(s)-min(af));
  if(trabalhadas<0){alert('Verifique os horários informados.');return}
  registros.push({data,entrada:e,ai,af,saida:s,trabalhadas,extra:Math.max(0,trabalhadas-480)});
  salvar();
  ['entrada','almocoInicio','almocoFim','saida'].forEach(id=>$(id).value='');
}
function remover(i){registros.splice(i,1);salvar()}
$('btnAdicionar').onclick=()=>adicionar(false);
$('btnFolga').onclick=()=>adicionar(true);
$('btnLimpar').onclick=()=>{if(confirm('Apagar todos os registros?')){registros=[];salvar()}};
$('btnImprimir').onclick=()=>window.print();
$('btnPdf').onclick=()=>{alert('Na janela de impressão, escolha “Salvar como PDF”.');window.print()};
$('btnExcel').onclick=()=>{
 let csv='Data;Entrada;Almoço início;Retorno;Saída;Horas trabalhadas;Hora extra\n';
 registros.forEach(r=>csv+=`${r.data};${r.entrada||''};${r.ai||''};${r.af||''};${r.saida||''};${r.folga?'Folga':fmt(r.trabalhadas)};${r.folga?'':fmt(r.extra)}\n`);
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\\ufeff'+csv],{type:'text/csv;charset=utf-8'}));a.download='hora-tedde.csv';a.click();
};
$('btnTema').onclick=()=>{
 document.body.classList.toggle('dark');
 localStorage.setItem(THEME,document.body.classList.contains('dark')?'dark':'light');
 $('btnTema').textContent=document.body.classList.contains('dark')?'☀️':'🌙';
};
if(localStorage.getItem(THEME)==='dark'){$('btnTema').click()}
$('data').value=new Date().toISOString().slice(0,10);
render();
