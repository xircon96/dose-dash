// Question generators and marking, shared with the Dose Dash solo game.
// Generated from the //GEN-START ... //GEN-END block in public/index.html.

/* ================= helpers ================= */
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const P=a=>a[Math.floor(Math.random()*a.length)];
const rd=(x,dp)=>{const f=Math.pow(10,dp);return Math.round(x*f+(x>=0?1e-9:-1e-9))/f;};
const nf=x=>{const v=rd(x,4);return v.toLocaleString('en-GB',{maximumFractionDigits:4});};
const nfd=(x,dp)=>rd(x,dp).toLocaleString('en-GB',{minimumFractionDigits:dp,maximumFractionDigits:dp});
const fa=(q,v)=>q.dp!=null?nfd(v,q.dp):nf(v);
const sgn=x=>(x>0?'+':'')+nf(x);
const pl=(n,w)=>n===1?w:w+'s';
const sum=a=>a.reduce((s,x)=>s+x,0);
const hm=t=>{const h=Math.floor(t+1e-9),m=Math.round((t-h)*60);return (h?h+' '+pl(h,'hour'):'')+(h&&m?' ':'')+(m?m+' minutes':'');};
const andList=a=>a.length<2?a.join(''):a.slice(0,-1).join(', ')+' and '+a[a.length-1];
const TO_MG={mcg:0.001,mg:1,g:1000};
const dstr=(v,u)=>nf(v)+' '+(u==='mcg'?pl(v,'microgram'):u);

function Q(o){
  if(o.dp==null){o.answer=rd(o.answer,4);o.tol=0.001;}
  else{o.exact=o.answer;o.answer=rd(o.answer,o.dp);o.tol=o.dp===0?0.001:0.5*Math.pow(10,-o.dp)+1e-9;}
  o.traps=(o.traps||[]).filter(t=>t&&isFinite(t[0])&&Math.abs(t[0]-o.answer)>o.tol);
  o.steps=o.steps.map(x=>x.replace(/(^|[^\d.])1 tablets/g,'$11 tablet'));
  o.alts=[...(o.alts||[]),...o.traps.map(t=>t[0])];
  return o;
}

/* ================= fields ================= */
const FIELDS={
  adult:{label:'Adult',icon:'',color:'#2D5BE3',
    names:['Mr Okafor','Mrs Jones','Ms Kaur','Mr Davies','Mrs Chen','Mr Murphy','Ms Ahmed','Mrs Williams','Mr Nowak','Ms Evans'],
    places:['on a surgical ward','on the acute medical unit','on a respiratory ward','on an orthopaedic ward','on a care of older people ward','in a GP practice nurse clinic'],
    hosp:['on a surgical ward','on the acute medical unit','on a respiratory ward','on an orthopaedic ward','on a care of older people ward']},
  child:{label:'Child',icon:'',color:'#E07A00',
    names:[['Ava',6],['Noah',4],['Ivy',8],['Theo',5],['Zara',7],['Oscar',3],['Maya',9],['Alfie',10],['Isla',2],['Leo',6]],
    places:["on the children's ward","in the paediatric assessment unit","on a children's surgical ward"],
    hosp:["on the children's ward","in the paediatric assessment unit","on a children's surgical ward"]},
  mh:{label:'Mental health',icon:'',color:'#7B4FE0',
    names:['Jordan','Sam','Priya','Daniel','Chloe','Marcus','Aisha','Tom','Kofi','Megan'],
    places:['on an acute mental health inpatient ward','at a community mental health team clinic','on a psychiatric intensive care unit','on an older adult mental health ward','at a crisis team home visit'],
    hosp:['on a general medical ward, supported by the mental health liaison team','on the acute medical unit after transfer from the mental health unit']},
  ld:{label:'Learning disability',icon:'',color:'#13865B',
    names:['Ben','Grace','Ryan','Sophie','Liam','Hannah','Kieran','Ellie','Josh','Fatima'],
    places:['in a supported living service','at their annual health check','in a specialist learning disability assessment unit','at a respite service','at home with their support worker'],
    hosp:['on a medical ward, supported by the learning disability liaison nurse','in hospital, with their hospital passport in the notes']}
};
function ctx(f,hosp){
  const F=FIELDS[f];const n=P(F.names);
  const c={f,place:P(hosp?F.hosp:F.places)};
  if(f==='child'){c.short=n[0];c.age=n[1];c.who=`${n[0]}, aged ${n[1]},`;c.weight=(n[1]+4)*2;}
  else{c.short=n;c.who=n;}
  return c;
}
function teen(){
  const n=P([['Jade',16],['Ethan',15],['Ruby',17],['Kai',16],['Leah',15],['Harvey',17]]);
  return {f:'child',short:n[0],who:`${n[0]}, aged ${n[1]},`,place:P(['at a school nurse drop-in',"at a young people's clinic",'on the adolescent ward'])};
}

/* ================= WIG data ================= */
const WG={
 adult:{
  1:[{n:'Paracetamol',s:'500 mg tablets',st:500,d:[1000]},
     {n:'Furosemide',s:'40 mg tablets',st:40,d:[40,80]},
     {n:'Prednisolone',s:'5 mg tablets',st:5,d:[20,30,40]},
     {n:'Codeine phosphate',s:'30 mg tablets',st:30,d:[30,60]},
     {n:'Ondansetron',s:'injection 4 mg in 2 mL',st:4,v:2,out:'mL',r:'IV',d:[4,8]},
     {n:'Furosemide',s:'injection 10 mg/mL',st:10,out:'mL',r:'IV',d:[20,40]}],
  2:[{n:'Amoxicillin',s:'oral suspension 250 mg in 5 mL',st:250,v:5,out:'mL',d:[500]},
     {n:'Morphine sulfate',s:'oral solution 10 mg in 5 mL',st:10,v:5,out:'mL',d:[2.5,5]},
     {n:'Oxycodone',s:'oral solution 5 mg in 5 mL',st:5,v:5,out:'mL',d:[2.5,7.5]},
     {n:'Metoclopramide',s:'injection 10 mg in 2 mL',st:10,v:2,out:'mL',r:'IV',d:[5]},
     {n:'Cyclizine',s:'injection 50 mg/mL',st:50,out:'mL',r:'IV',d:[25]},
     {n:'Furosemide',s:'40 mg tablets',st:40,d:[20]},
     {n:'Paracetamol',s:'oral suspension 250 mg in 5 mL',st:250,v:5,out:'mL',d:[500,1000]}],
  3:[{n:'Paracetamol',s:'500 mg tablets',st:500,d:[[1,'g']]},
     {n:'Metformin',s:'500 mg tablets',st:500,d:[[1,'g']]},
     {n:'Digoxin',s:'62.5 microgram tablets',st:62.5,su:'mcg',d:[[0.125,'mg'],[0.0625,'mg']]},
     {n:'Levothyroxine',s:'25 microgram tablets',st:25,su:'mcg',d:[[0.05,'mg'],[0.075,'mg'],[0.1,'mg']]},
     {n:'Amoxicillin',s:'oral suspension 250 mg in 5 mL',st:250,v:5,out:'mL',d:[[0.5,'g'],[1,'g']]}]
 },
 child:{
  1:[{n:'Paracetamol',s:'oral suspension 120 mg in 5 mL',st:120,v:5,out:'mL',d:[120,240]},
     {n:'Ibuprofen',s:'oral suspension 100 mg in 5 mL',st:100,v:5,out:'mL',d:[100,200]},
     {n:'Amoxicillin',s:'oral suspension 125 mg in 5 mL',st:125,v:5,out:'mL',d:[125,250]},
     {n:'Prednisolone',s:'5 mg soluble tablets',st:5,d:[10,20]}],
  2:[{n:'Paracetamol',s:'oral suspension 120 mg in 5 mL',st:120,v:5,out:'mL',d:[60,180]},
     {n:'Ibuprofen',s:'oral suspension 100 mg in 5 mL',st:100,v:5,out:'mL',d:[50,150]},
     {n:'Phenoxymethylpenicillin',s:'oral solution 125 mg in 5 mL',st:125,v:5,out:'mL',d:[62.5]},
     {n:'Trimethoprim',s:'oral suspension 50 mg in 5 mL',st:50,v:5,out:'mL',d:[25,75]},
     {n:'Amoxicillin',s:'oral suspension 250 mg in 5 mL',st:250,v:5,out:'mL',d:[125,375]}],
  3:[{n:'Amoxicillin',s:'oral suspension 250 mg in 5 mL',st:250,v:5,out:'mL',d:[[0.25,'g'],[0.5,'g']]},
     {n:'Digoxin',s:'oral solution 50 micrograms/mL',st:50,su:'mcg',out:'mL',d:[[0.1,'mg'],[0.05,'mg']]},
     {n:'Levothyroxine',s:'oral solution 25 micrograms in 5 mL',st:25,su:'mcg',v:5,out:'mL',d:[[0.025,'mg'],[0.05,'mg']]},
     {n:'Paracetamol',s:'oral suspension 120 mg in 5 mL',st:120,v:5,out:'mL',d:[[0.24,'g'],[0.18,'g']]}]
 },
 mh:{
  1:[{n:'Olanzapine',s:'5 mg tablets',st:5,d:[5,10]},
     {n:'Sertraline',s:'50 mg tablets',st:50,d:[50,100]},
     {n:'Lorazepam',s:'1 mg tablets',st:1,d:[1,2]},
     {n:'Promethazine',s:'25 mg tablets',st:25,d:[25,50]},
     {n:'Quetiapine',s:'25 mg tablets',st:25,d:[50,75]},
     {n:'Procyclidine',s:'5 mg tablets',st:5,d:[5,10]},
     {n:'Haloperidol',s:'injection 5 mg/mL',st:5,out:'mL',r:'IM',d:[5]}],
  2:[{n:'Lorazepam',s:'1 mg tablets',st:1,d:[0.5]},
     {n:'Haloperidol',s:'injection 5 mg/mL',st:5,out:'mL',r:'IM',d:[2.5]},
     {n:'Lithium citrate',s:'oral solution 520 mg in 5 mL',st:520,v:5,out:'mL',d:[780,1040]},
     {n:'Risperidone',s:'oral solution 1 mg/mL',st:1,out:'mL',d:[0.5,1.5,2]},
     {n:'Aripiprazole',s:'oral solution 1 mg/mL',st:1,out:'mL',d:[10,15]},
     {n:'Diazepam',s:'oral solution 2 mg in 5 mL',st:2,v:5,out:'mL',d:[4,5]},
     {n:'Olanzapine',s:'2.5 mg tablets',st:2.5,d:[7.5]}],
  3:[{n:'Lithium carbonate',s:'400 mg modified-release tablets',st:400,d:[[0.4,'g'],[0.8,'g']]},
     {n:'Sertraline',s:'50 mg tablets',st:50,d:[[0.1,'g'],[0.15,'g']]},
     {n:'Lorazepam',s:'1 mg tablets',st:1,d:[[500,'mcg']]},
     {n:'Haloperidol',s:'500 microgram tablets',st:500,su:'mcg',d:[[1,'mg'],[1.5,'mg']]},
     {n:'Quetiapine',s:'100 mg tablets',st:100,d:[[0.2,'g'],[0.3,'g']]}]
 },
 ld:{
  1:[{n:'Lamotrigine',s:'25 mg dispersible tablets',st:25,d:[25,50,100]},
     {n:'Sodium valproate',s:'oral solution 200 mg in 5 mL',st:200,v:5,out:'mL',d:[200,400]},
     {n:'Carbamazepine',s:'oral suspension 100 mg in 5 mL',st:100,v:5,out:'mL',d:[100,200]},
     {n:'Paracetamol',s:'oral suspension 250 mg in 5 mL',st:250,v:5,out:'mL',d:[500,1000]},
     {n:'Levetiracetam',s:'oral solution 100 mg/mL',st:100,out:'mL',d:[500,1000]}],
  2:[{n:'Sodium valproate',s:'oral solution 200 mg in 5 mL',st:200,v:5,out:'mL',d:[300,500]},
     {n:'Levetiracetam',s:'oral solution 100 mg/mL',st:100,out:'mL',d:[250,750]},
     {n:'Carbamazepine',s:'oral suspension 100 mg in 5 mL',st:100,v:5,out:'mL',d:[150,300]},
     {n:'Risperidone',s:'oral solution 1 mg/mL',st:1,out:'mL',d:[0.5]},
     {n:'Clobazam',s:'10 mg tablets',st:10,d:[5]}],
  3:[{n:'Levetiracetam',s:'oral solution 100 mg/mL',st:100,out:'mL',d:[[1,'g'],[1.5,'g']]},
     {n:'Sodium valproate',s:'oral solution 200 mg in 5 mL',st:200,v:5,out:'mL',d:[[0.4,'g'],[0.6,'g']]},
     {n:'Levothyroxine',s:'oral solution 50 micrograms in 5 mL',st:50,su:'mcg',v:5,out:'mL',d:[[0.1,'mg'],[0.075,'mg'],[0.05,'mg']]},
     {n:'Lamotrigine',s:'25 mg dispersible tablets',st:25,d:[[0.1,'g']]}]
 }
};
const norm=e=>Object.assign({su:'mg',v:1,out:'tab',r:'orally'},e);

/* ================= WIG ================= */
function genWIG(L,f){
  const c=ctx(f);
  if(L===4) return wig4(c);
  const e=norm(P(WG[f][L]));
  let dose=P(e.d),du=e.su;
  if(Array.isArray(dose)){du=dose[1];dose=dose[0];}
  const want=rd(dose*TO_MG[du]/TO_MG[e.su],6);
  const ans=want/e.st*e.v,tab=e.out==='tab';
  const extra=(f==='ld'&&!tab&&e.r==='orally')?' They find tablets hard to swallow, so a liquid has been prescribed.':'';
  const steps=[];
  if(du!==e.su) steps.push(`The units do not match, so convert first: ${dstr(dose,du)} ${TO_MG[du]>TO_MG[e.su]?'× 1000':'÷ 1000'} = <b>${dstr(want,e.su)}</b>`);
  steps.push(`Use WIG: Want ${nf(want)}, Got ${nf(e.st)}, In ${tab?'1 tablet':nf(e.v)+' mL'}`);
  steps.push(`${nf(want)} ÷ ${nf(e.st)} × ${tab?'1':nf(e.v)} = <b>${nf(ans)} ${tab?pl(ans,'tablet'):'mL'}</b>`);
  return Q({fk:'wig',drug:e.n,
    text:`${c.who} is ${c.place}.${extra} They are prescribed <b>${e.n} ${dstr(dose,du)} ${e.r}</b>. You have <b>${e.n} ${e.s}</b>.`,
    ask:tab?'How many tablets will you give?':'What volume will you give?',
    answer:ans,unit:tab?'tablets':'mL',steps,
    hint:'Check the units match first. Then put the numbers into Want ÷ Got × In.',
    traps:[[e.st/want*e.v,'inverted'],du!==e.su?[dose/e.st*e.v,'noconv']:null],alts:[ans*2]});
}
function wig4(c){
  const f=c.f;
  if(f==='adult'){
    if(Math.random()<0.5){
      const w=R(36,49),mg=15*w,ml=mg/10;
      return Q({fk:'mgkg',drug:'Paracetamol',text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. They are prescribed <b>IV paracetamol 15 mg/kg</b> (the dose for adults under 50 kg). The infusion contains <b>10 mg/mL</b>.`,
        ask:'What volume of paracetamol infusion is needed?',answer:ml,unit:'mL',
        steps:[`Dose = 15 mg × ${w} kg = <b>${nf(mg)} mg</b>`,`Volume = ${nf(mg)} ÷ 10 × 1 = <b>${nf(ml)} mL</b>`],
        hint:'Step 1: dose per kg × weight. Step 2: Want ÷ Got × In.',traps:[[15*w/100,'calc'],[10/mg,'inverted']],alts:[ml/10]});
    }
    const dose=P([30,40]),days=P([5,7]),per=dose/5,tot=per*days;
    return Q({fk:'course',drug:'Prednisolone',text:`${c.who} is ${c.place}. They are prescribed <b>prednisolone ${dose} mg once daily for ${days} days</b>. You have <b>prednisolone 5 mg tablets</b>.`,
      ask:'How many tablets are needed for the whole course?',answer:tot,unit:'tablets',
      steps:[`Tablets per dose = ${dose} ÷ 5 = <b>${per}</b>`,`Whole course = ${per} × ${days} days = <b>${tot} tablets</b>`],
      hint:'Work out one dose first, then multiply by the number of days.',traps:[[per,'missedstep']],alts:[dose*days/10]});
  }
  if(f==='child'){
    const w=c.weight;
    if(Math.random()<0.5){
      const mg=15*w,ml=mg/120*5;
      return Q({fk:'mgkg',drug:'Paracetamol',text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. They are prescribed <b>paracetamol 15 mg/kg</b> orally. You have <b>paracetamol oral suspension 120 mg in 5 mL</b>.`,
        ask:'What volume will you give? Round to 1 decimal place.',answer:ml,dp:1,unit:'mL',
        steps:[`Dose = 15 mg × ${w} kg = <b>${nf(mg)} mg</b>`,`Volume = ${nf(mg)} ÷ 120 × 5 = ${nf(ml)}`,`Rounded to 1 decimal place: <b>${nfd(ml,1)} mL</b>`],
        hint:'Step 1: dose per kg × weight. Step 2: Want ÷ Got × In.',traps:[[120/mg*5,'inverted'],[mg/120,'missedstep']]});
    }
    const mg=5*w,ml=mg/100*5;
    return Q({fk:'mgkg',drug:'Ibuprofen',text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. They are prescribed <b>ibuprofen 5 mg/kg</b> orally. You have <b>ibuprofen oral suspension 100 mg in 5 mL</b>.`,
      ask:'What volume will you give?',answer:ml,unit:'mL',
      steps:[`Dose = 5 mg × ${w} kg = <b>${nf(mg)} mg</b>`,`Volume = ${nf(mg)} ÷ 100 × 5 = <b>${nf(ml)} mL</b>`],
      hint:'Step 1: dose per kg × weight. Step 2: Want ÷ Got × In.',traps:[[mg/100,'missedstep'],[100/mg*5,'inverted']],alts:[ml*2]});
  }
  if(f==='mh'){
    const t=R(0,2);
    if(t===0){
      const [drug,st,doses,when]=P([['sertraline',50,[100,150],'once daily'],['olanzapine',5,[10,15,20],'at night'],['mirtazapine',15,[30,45],'at night']]);
      const dose=P(doses),days=P([7,14,28]),per=dose/st,tot=per*days;
      return Q({fk:'course',drug,text:`${c.who} is going home with a supply of medicine. They are prescribed <b>${drug} ${dose} mg ${when}</b>. You have <b>${drug} ${st} mg tablets</b>.`,
        ask:`How many tablets are needed for a ${days} day supply?`,answer:tot,unit:'tablets',
        steps:[`Tablets per day = ${dose} ÷ ${st} = <b>${per}</b>`,`For ${days} days: ${per} × ${days} = <b>${tot} tablets</b>`],
        hint:'Tablets per day first, then multiply by the number of days.',traps:[[per,'missedstep']],alts:[days,tot/2]});
    }
    if(t===1){
      const [daily,st]=P([[300,50],[400,100],[600,100]]),per=daily/2,tabs=per/st;
      return Q({fk:'divided',drug:'Quetiapine',text:`${c.who} is ${c.place}. They are prescribed <b>quetiapine ${daily} mg daily in 2 divided doses</b>. You have <b>quetiapine ${st} mg tablets</b>.`,
        ask:'How many tablets are needed for each dose?',answer:tabs,unit:'tablets',
        steps:[`Each dose = ${daily} ÷ 2 = <b>${per} mg</b>`,`WIG: ${per} ÷ ${st} × 1 = <b>${nf(tabs)} tablets</b>`],
        hint:'Split the daily dose first, then use Want ÷ Got × In.',traps:[[daily/st,'notdivided']],alts:[tabs+1]});
    }
    const daily=P([1040,1560,2080]),per=daily/2,ml=per/520*5;
    return Q({fk:'divided',drug:'Lithium citrate',text:`${c.who} is ${c.place}. They are prescribed <b>lithium citrate ${daily} mg daily in 2 divided doses</b>. You have <b>lithium citrate oral solution 520 mg in 5 mL</b>.`,
      ask:'What volume is needed for each dose?',answer:ml,unit:'mL',
      steps:[`Each dose = ${daily} ÷ 2 = <b>${per} mg</b>`,`WIG: ${per} ÷ 520 × 5 = <b>${nf(ml)} mL</b>`],
      hint:'Split the daily dose first, then use Want ÷ Got × In.',traps:[[daily/520*5,'notdivided'],[520/per*5,'inverted']]});
  }
  if(Math.random()<0.5){
    const w=P([50,60,70,80]),daily=20*w,per=daily/2,ml=per/200*5;
    return Q({fk:'divided',drug:'Sodium valproate',text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. They are prescribed <b>sodium valproate 20 mg/kg/day in 2 divided doses</b>. They find tablets hard to swallow, so you have <b>sodium valproate oral solution 200 mg in 5 mL</b>.`,
      ask:'What volume is needed for each dose?',answer:ml,unit:'mL',
      steps:[`Daily dose = 20 mg × ${w} kg = <b>${nf(daily)} mg</b>`,`Each dose = ${nf(daily)} ÷ 2 = <b>${nf(per)} mg</b>`,`WIG: ${nf(per)} ÷ 200 × 5 = <b>${nf(ml)} mL</b>`],
      hint:'Dose per kg × weight, split into doses, then Want ÷ Got × In.',traps:[[ml*2,'notdivided'],[per/200,'missedstep']]});
  }
  const daily=P([400,600,800]),per=daily/2,ml=per/100*5;
  return Q({fk:'divided',drug:'Carbamazepine',text:`${c.who} is ${c.place}. They are prescribed <b>carbamazepine ${daily} mg daily in 2 divided doses</b>. You have <b>carbamazepine oral suspension 100 mg in 5 mL</b>.`,
    ask:'What volume is needed for each dose?',answer:ml,unit:'mL',
    steps:[`Each dose = ${daily} ÷ 2 = <b>${per} mg</b>`,`WIG: ${per} ÷ 100 × 5 = <b>${nf(ml)} mL</b>`],
    hint:'Split the daily dose first, then use Want ÷ Got × In.',traps:[[ml*2,'notdivided'],[per/100,'missedstep']]});
}

/* ================= Conversions ================= */
const CF={'g>mg':1000,'mg>g':0.001,'L>mL':1000,'mL>L':0.001,'mg>mcg':1000,'mcg>mg':0.001,'kg>g':1000,'h>min':60,'min>h':1/60};
const UN={g:'g',mg:'mg',mcg:'micrograms',L:'L',mL:'mL',kg:'kg',h:'hours',min:'minutes'};
const CONV1=[['g','mg',[0.5,1,1.5,2,2.5,3]],['mg','g',[500,1000,1500,2000,3000]],['L','mL',[0.5,1,1.5,2,3]],['mL','L',[500,1000,1500,2000,2500]],['mg','mcg',[1,2,0.5,3]],['kg','g',[1,2,2.5,3.5]]];
const CONV2=[['g','mg',[0.25,0.125,0.75,0.05,0.6]],['mg','mcg',[0.125,0.25,0.4,0.075,0.0625]],['mcg','mg',[250,125,62.5,50,500,25]],['mL','L',[250,750,125,50]],['h','min',[1.5,2.5,0.75,1.25,0.25]],['min','h',[90,45,150,30,15]]];
const CONV_LEAD={adult:['Checking a drug chart on the ward:','Getting ready for the medicines round:','Quick check before handover:'],
  child:["On the children's ward:","Checking a child's prescription chart:"],
  mh:['On the mental health ward medicines round:','Preparing for the depot clinic:','Checking a discharge prescription:'],
  ld:['Checking a medicines administration record (MAR) in supported living:','Preparing for an annual health check:']};
const DAILY={
  adult:[['Amoxicillin','amoxicillin 500 mg three times a day',500,3,'per day'],['Paracetamol','paracetamol 1000 mg four times a day',1000,4,'per day'],['Metformin','metformin 500 mg three times a day',500,3,'per day'],['Codeine phosphate','codeine phosphate 30 mg four times a day',30,4,'per day']],
  child:[['Paracetamol','paracetamol 240 mg four times a day',240,4,'per day'],['Amoxicillin','amoxicillin 250 mg three times a day',250,3,'per day'],['Ibuprofen','ibuprofen 150 mg three times a day',150,3,'per day']],
  mh:[['Lithium carbonate','lithium carbonate 400 mg twice a day',400,2,'per day'],['Quetiapine','quetiapine 150 mg twice a day',150,2,'per day'],['Sertraline','sertraline 100 mg once a day',100,7,'per week']],
  ld:[['Sodium valproate','sodium valproate 600 mg twice a day',600,2,'per day'],['Levetiracetam','levetiracetam 750 mg twice a day',750,2,'per day'],['Carbamazepine','carbamazepine 200 mg twice a day',200,2,'per day']]};
const WEEKLY={adult:[['Levothyroxine',100],['Digoxin',125]],child:[['Levothyroxine',25]],mh:[['Levothyroxine',50]],ld:[['Levothyroxine',75],['Levothyroxine',100]]};
const CUP={adult:['cups of tea',200],child:['beakers of milk',120],mh:['mugs of coffee',250],ld:['beakers of thickened juice',150]};
function genConv(L,f){
  const c=ctx(f);
  if(L<=2){
    const [a,b,vals]=P(L===1?CONV1:CONV2),v=P(vals),k=CF[a+'>'+b],ans=v*k,time=(a==='h'||a==='min');
    const op=k>1?`× ${nf(k)}`:`÷ ${nf(1/k)}`;
    const why=time?(k>1?'There are 60 minutes in an hour, so multiply by 60.':'There are 60 minutes in an hour, so divide by 60.')
                   :(k>1?'Bigger unit to smaller unit, so the number gets bigger: multiply by 1000.':'Smaller unit to bigger unit, so the number gets smaller: divide by 1000.');
    return Q({fk:time?'time':'conv',text:`${P(CONV_LEAD[f])} convert <b>${nf(v)} ${UN[a]}</b> into <b>${UN[b]}</b>.`,ask:`What is it in ${UN[b]}?`,answer:ans,unit:UN[b],
      steps:[why,`${nf(v)} ${op} = <b>${nf(ans)} ${UN[b]}</b>`],
      hint:time?'Hours to minutes: × 60. Minutes to hours: ÷ 60.':'Ask yourself: should the number get bigger or smaller?',
      traps:[[v/k,'wrongway']]});
  }
  if(L===3){
    const t=R(0,3);
    if(t===3) return imperialConv(c,f);
    if(t===0){
      const [drug,lab,mg,n,per]=P(DAILY[f]),tot=mg*n,g=tot/1000;
      return Q({fk:'conv',drug,text:`${c.who} is ${c.place} and takes <b>${lab}</b>.`,ask:`What is the total dose in grams ${per}?`,answer:g,unit:'g',
        steps:[`Total = ${nf(mg)} mg × ${n} = <b>${nf(tot)} mg</b>`,`mg to g: ${nf(tot)} ÷ 1000 = <b>${nf(g)} g</b>`],
        hint:'Find the total in mg first, then divide by 1000 to get grams.',traps:[[mg/1000,'missedstep']],alts:[g*10]});
    }
    if(t===1){
      const [drug,mcg]=P(WEEKLY[f]),wk=mcg*7,mg=wk/1000;
      return Q({fk:'conv',drug,text:`${c.who} is ${c.place} and takes <b>${drug.toLowerCase()} ${mcg} micrograms once a day</b>.`,ask:'How many mg is that in one week?',answer:mg,unit:'mg',
        steps:[`Weekly total = ${mcg} × 7 = <b>${nf(wk)} micrograms</b>`,`micrograms to mg: ${nf(wk)} ÷ 1000 = <b>${nf(mg)} mg</b>`],
        hint:'Multiply by 7 days, then divide by 1000 to change micrograms into mg.',traps:[[mcg/1000,'missedstep']],alts:[mg*10]});
    }
    const [what,size]=CUP[f],n=R(5,8),ml=n*size,l=ml/1000;
    return Q({fk:'cups',text:`${c.who} is ${c.place}. Today they have had <b>${n} ${what}</b>, each holding <b>${size} mL</b>.`,ask:'What is their total intake in litres?',answer:l,unit:'L',
      steps:[`Total = ${n} × ${size} = <b>${nf(ml)} mL</b>`,`mL to L: ${nf(ml)} ÷ 1000 = <b>${nf(l)} L</b>`],
      hint:'Total in mL first, then divide by 1000 to get litres.',alts:[l*10]});
  }
  const ch=ctx(f,true);
  if(Math.random()<0.75){
    const opts=f==='child'?[['sodium chloride 0.9%',0.9,[500]],['glucose 10%',10,[100,250,500]],['glucose 5%',5,[500]]]
                         :[['sodium chloride 0.9%',0.9,[500,1000]],['glucose 5%',5,[500,1000]],['glucose 10%',10,[100,250,500]]];
    const [name,pct,vols]=P(opts),vol=P(vols),lots=vol/100,g=pct*lots,solute=name.split(' ').slice(0,-1).join(' ');
    return Q({fk:'pct',text:`${ch.who} is ${ch.place}. They have a bag of <b>${vol} mL ${name}</b>.`,ask:`How many grams of ${solute} are in the bag?`,answer:g,unit:'g',
      steps:[`% w/v means grams in every 100 mL, so ${name} has <b>${nf(pct)} g in 100 mL</b>`,`Number of 100 mL lots = ${vol} ÷ 100 = ${nf(lots)}`,`${nf(pct)} g × ${nf(lots)} = <b>${nf(g)} g</b>`],
      hint:'Percentage w/v = grams in 100 mL.',traps:[[pct*vol,'missedstep']],alts:[g*10,g/10]});
  }
  const ml=P([2,5,10]),mg=ml*10;
  return Q({fk:'pct',drug:'Lidocaine',text:`${ch.who} is ${ch.place} and needs a cannula. The doctor uses <b>${ml} mL of lidocaine 1%</b> as local anaesthetic.`,ask:'How many mg of lidocaine is that?',answer:mg,unit:'mg',
    steps:['1% w/v = 1 g in 100 mL = 1000 mg in 100 mL = <b>10 mg in 1 mL</b>',`${ml} mL × 10 mg = <b>${mg} mg</b>`],
    hint:'1% means 1 g in 100 mL. Change that into mg per mL.',traps:[[ml,'missedstep'],[ml/100,'missedstep']],alts:[mg*10]});
}


/* ================= UK patient-reported measurements ================= */
const IMP_NOTE='Use <b>1 stone = 14 lb</b>, <b>1 kg = 2.2 lb</b>, <b>1 foot = 12 inches</b> and <b>1 inch = 2.54 cm</b>.';
function imperialConv(c,f){
  if(f==='child'){
    const lb=R(5,9),oz=R(0,15),totLb=lb+oz/16,kg=totLb/2.2;
    const q=Q({fk:'imperial',text:`${c.who} is ${c.place}. Their parent says their birth weight was <b>${lb} lb ${oz} oz</b>. Use <b>1 lb = 16 oz</b> and <b>1 kg = 2.2 lb</b>.`,
      ask:'What was the birth weight in kg? Round to 2 decimal places.',answer:kg,dp:2,unit:'kg',
      steps:[`Ounces to pounds: ${oz} ÷ 16 = ${nf(oz/16)} lb`,`Total = ${lb} + ${nf(oz/16)} = ${nf(totLb)} lb`,`Pounds to kg: ${nf(totLb)} ÷ 2.2 = ${nf(kg)}, so <b>${nfd(kg,2)} kg</b>`],
      hint:'Turn the ounces into pounds first (÷ 16), then divide the pounds by 2.2.',traps:[[(lb+oz/10)/2.2,'calc'],[totLb*2.2,'inverted']]});
    q.tol=0.011;return q;
  }
  if(Math.random()<0.6){
    const st=R(7,17),lb=R(0,13),totLb=st*14+lb,kg=totLb/2.2;
    return Q({fk:'imperial',text:`${c.who} is ${c.place}. They tell you they weigh <b>${st} stone ${lb} lb</b>. Weights must be recorded in kg. Use <b>1 stone = 14 lb</b> and <b>1 kg = 2.2 lb</b>.`,
      ask:'What is their weight in kg? Round to 1 decimal place.',answer:kg,dp:1,unit:'kg',
      steps:[`Stones to pounds: ${st} × 14 = ${st*14} lb`,`Total = ${st*14} + ${lb} = ${totLb} lb`,`Pounds to kg: ${totLb} ÷ 2.2 = ${nf(kg)}, so <b>${nfd(kg,1)} kg</b>`],
      hint:'Change everything into pounds first, then divide by 2.2.',traps:[[totLb*2.2,'inverted'],[(st*10+lb)/2.2,'calc'],[st*14/2.2,'missedstep']]});
  }
  const ft=P([4,5,5,5,6]),inch=ft===6?R(0,4):ft===4?R(8,11):R(0,11),totIn=ft*12+inch,cm=totIn*2.54;
  return Q({fk:'imperial',text:`${c.who} is ${c.place}. They tell you they are <b>${ft} feet ${inch} inches</b> tall. Use <b>1 foot = 12 inches</b> and <b>1 inch = 2.54 cm</b>.`,
    ask:'What is their height in cm? Round to 1 decimal place.',answer:cm,dp:1,unit:'cm',
    steps:[`Feet to inches: ${ft} × 12 = ${ft*12} inches`,`Total = ${ft*12} + ${inch} = ${totIn} inches`,`Inches to cm: ${totIn} × 2.54 = ${nf(cm)}, so <b>${nfd(cm,1)} cm</b>`],
    hint:'Change the feet into inches (× 12), add the inches, then × 2.54.',traps:[[totIn/2.54,'inverted'],[(ft*10+inch)*2.54,'calc'],[ft*12*2.54,'missedstep']]});
}
function bmiImperial(c,where){
  let st,lb,ft,inch,totLb,kg,totIn,m,b;
  do{st=R(8,16);lb=R(0,13);ft=P([5,5,5,6]);inch=ft===6?R(0,3):R(0,11);totLb=st*14+lb;kg=totLb/2.2;totIn=ft*12+inch;m=totIn*2.54/100;b=kg/(m*m);}while(b<17||b>40);
  const kgR=rd(kg,2),mR=rd(m,4),m2=rd(mR*mR,4),bS=kgR/m2;
  const note=`For adults, ${nfd(bS,1)} is in the standard <b>${bmiCat(rd(bS,1))}</b> range.`;
  const q=Q({fk:'bmiImp',text:`${c.who} is having their BMI checked ${where}. They tell you they weigh <b>${st} stone ${lb} lb</b> and are <b>${ft} feet ${inch} inches</b> tall. ${IMP_NOTE}`,
    ask:'What is their BMI? Round to 1 decimal place.',answer:bS,dp:1,unit:'kg/m²',note,
    steps:[`Weight: ${st} × 14 + ${lb} = ${totLb} lb, then ${totLb} ÷ 2.2 = ${nf(kgR)} kg`,`Height: ${ft} × 12 + ${inch} = ${totIn} inches, then ${totIn} × 2.54 = ${nf(totIn*2.54)} cm = ${nf(mR)} m`,`Height² = ${nf(mR)} × ${nf(mR)} = ${nf(m2)}`,`BMI = ${nf(kgR)} ÷ ${nf(m2)} = ${nf(bS)}, so <b>${nfd(bS,1)} kg/m²</b>`],
    hint:'Change the weight into kg and the height into metres first. Then BMI = weight ÷ height².',traps:[[totLb/(m*m),'noconv'],[kg/m,'nosquare']]});
  q.tol=0.1+1e-9;return q;
}

/* ================= BMI ================= */
const bmiCat=b=>b<18.5?'underweight':b<25?'healthy weight':b<30?'overweight':b<40?'obese':'severely obese';
const BMI_WHY={adult:'at a pre-operative assessment clinic',mh:'as part of physical health monitoring for antipsychotic medication',ld:'at their annual health check'};
function genBMI(L,f){
  const c=f==='child'?teen():ctx(f);
  const where=f==='child'?c.place:BMI_WHY[f];
  if(f!=='child'&&(L===2||L===3)&&Math.random()<0.35) return bmiImperial(c,where);
  let w,hcm,h,text,ask='What is their BMI? Round to 1 decimal place.';const steps=[];
  if(L===4&&f!=='child'){
    hcm=R(155,185);h=hcm/100;const h2=rd(h*h,4),b0=R(27,34)+R(0,9)/10;
    w=rd(b0*h2,1);const tw=25*h2,ans=w-tw;
    return Q({fk:'bmiTarget',text:`${c.who} has had their weight checked ${where}. They weigh <b>${nf(w)} kg</b> and are <b>${hcm} cm</b> tall. They would like to reach a BMI of 25.`,
      ask:'How many kg would they need to lose to reach a BMI of 25? Round to 1 decimal place.',answer:ans,dp:1,unit:'kg',
      steps:[`Height in metres = ${hcm} ÷ 100 = ${nf(h)} m`,`Height² = ${nf(h)} × ${nf(h)} = ${nf(h2)}`,`Target weight = 25 × ${nf(h2)} = ${nf(tw)} kg`,`Weight to lose = ${nf(w)} - ${nf(tw)} = ${nf(ans)}, so <b>${nfd(ans,1)} kg</b>`],
      hint:'Rearrange BMI: weight = BMI × height². Work out the target weight, then subtract.',traps:[[tw,'missedstep'],[w-25*h,'nosquare']]});
  }
  if(L===1){
    h=P([1.5,1.6,1.7,1.8]);w=R(50,95);
    text=`${c.who} is having their BMI checked ${where}. They weigh <b>${w} kg</b> and are <b>${nf(h)} m</b> tall.`;
  } else if(L===2){
    hcm=R(150,190);h=hcm/100;w=R(48,110);
    text=`${c.who} is having their BMI checked ${where}. They weigh <b>${w} kg</b> and are <b>${hcm} cm</b> tall.`;
  } else {
    hcm=L===4?R(1505,1849)/10:R(152,188);h=rd(hcm/100,4);
    const w0=R(50,90)+P([0,0.5]),chg=P([2,2.5,3,3.5,4,5]),gain=f!=='adult'||Math.random()<0.5;
    w=gain?w0+chg:w0-chg;
    text=`${c.who} was weighed ${where}. Last month they weighed <b>${nf(w0)} kg</b>. Since then they have ${gain?'gained':'lost'} <b>${nf(chg)} kg</b>. Their height is <b>${nf(hcm)} cm</b>.`;
    ask='What is their BMI now? Round to 1 decimal place.';
    steps.push(`Current weight = ${nf(w0)} ${gain?'+':'-'} ${nf(chg)} = <b>${nf(w)} kg</b>`);
  }
  const h2=rd(h*h,L===4?6:4),b=w/h2;
  if(hcm) steps.push(`Change cm to m: ${nf(hcm)} ÷ 100 = ${nf(h)} m`);
  steps.push(`Height² = ${nf(h)} × ${nf(h)} = ${nf(h2)}`);
  steps.push(`BMI = ${nf(w)} ÷ ${nf(h2)} = ${nf(b)}, so <b>${nfd(b,1)} kg/m²</b>`);
  const note=f==='child'?'For under 18s, the BMI is then plotted on a centile chart for age and sex.':`For adults, ${nfd(b,1)} is in the standard <b>${bmiCat(rd(b,1))}</b> range.`;
  return Q({fk:'bmi',text,ask,answer:b,dp:1,unit:'kg/m²',steps,note,hint:'Change cm to m (÷ 100). Square the height (height × height). Then weight ÷ height².',traps:[[w/h,'nosquare'],[w/(h*2),'nosquare'],[h2/w,'inverted']]});
}

/* ================= Flow rates ================= */
const FLUID={adult:['sodium chloride 0.9%',"Hartmann's solution",'glucose 5%'],child:['sodium chloride 0.9% with glucose 5%','sodium chloride 0.9%'],mh:['sodium chloride 0.9%','glucose 5%'],ld:['sodium chloride 0.9%',"Hartmann's solution"]};
function genFlow(L,f){
  const c=ctx(f,true),fl=P(FLUID[f]),kid=f==='child';
  if(L===1){
    const [v,h]=P(kid?[[500,10],[250,5],[480,12],[360,12],[500,20],[240,8]]:[[1000,8],[1000,10],[500,4],[500,5],[1000,4],[1000,5],[500,10],[250,2]]);
    const ans=v/h;
    return Q({fk:'rate',text:`${c.who} is ${c.place}. They are prescribed <b>${v} mL of ${fl}</b> to run over <b>${h} hours</b> using an infusion pump.`,
      ask:'What rate should you set the pump to?',answer:ans,unit:'mL/h',
      steps:['Rate (mL/h) = volume (mL) ÷ time (hours)',`${v} ÷ ${h} = <b>${nf(ans)} mL/h</b>`],hint:'Pumps work in mL per hour: volume ÷ hours.',traps:[[v/(h*60),'minutes'],[h/v,'inverted']],alts:[ans*2,ans/2]});
  }
  if(L===2){
    if(Math.random()<0.5){
      const [v,m]=P(kid?[[50,30],[20,30],[50,15],[25,30],[30,20]]:[[100,30],[100,20],[250,60],[50,15],[100,15],[250,30],[50,30]]);
      const ans=v/m*60;
      return Q({fk:'rateMin',text:`${c.who} is ${c.place}. They are prescribed an <b>IV antibiotic diluted to ${v} mL</b>, to be given over <b>${m} minutes</b> by infusion pump.`,
        ask:'What rate should you set the pump to?',answer:ans,unit:'mL/h',
        steps:['Pumps run in mL per <b>hour</b>, but the time is in minutes.',`Rate = volume ÷ minutes × 60 = ${v} ÷ ${m} × 60 = <b>${nf(ans)} mL/h</b>`],
        hint:'Minutes are not hours! Divide by the minutes, then × 60.',traps:[[v/m,'minutes'],[v*m/60,'inverted']],alts:[v]});
    }
    const [v,h]=P(kid?[[500,12],[250,6],[400,24],[1000,24],[500,7]]:[[1000,6],[1000,12],[500,3],[500,6],[1000,9],[500,12]]);
    const ex=v/h;
    return Q({fk:'rate',text:`${c.who} is ${c.place}. They are prescribed <b>${v} mL of ${fl}</b> over <b>${h} hours</b> by infusion pump.`,
      ask:'What rate should you set? Round to 1 decimal place.',answer:ex,dp:1,unit:'mL/h',
      steps:['Rate (mL/h) = volume ÷ hours',`${v} ÷ ${h} = ${nf(ex)}`,`Rounded to 1 decimal place: <b>${nfd(ex,1)} mL/h</b>`],hint:'mL/h = volume ÷ hours. Round only at the end.',traps:[[v/(h*60),'minutes']],alts:[ex*2,ex+10]});
  }
  if(L===3){
    if(kid){
      const v=P([1100,1200,1300,1400,1500]),ex=v/24;
      return Q({fk:'rate',text:`${c.who} is ${c.place}. They need <b>${v} mL of ${fl}</b> over <b>24 hours</b>. Children's IV fluids always run through a pump.`,
        ask:'What hourly rate should the pump be set to? Round to 1 decimal place.',answer:ex,dp:1,unit:'mL/h',
        steps:['Rate = volume ÷ hours',`${v} ÷ 24 = ${nf(ex)}`,`Rounded to 1 decimal place: <b>${nfd(ex,1)} mL/h</b>`],hint:'There are 24 hours in a day.',traps:[[v/(24*60),'minutes'],[v/12,'calc']],alts:[ex*2]});
    }
    const v=P([500,1000]),h=P([4,5,6,8,10,12]),m=h*60,ex=v*20/m;
    return Q({fk:'drops',text:`${c.who} is ${c.place}. They are prescribed <b>${v} mL of ${fl}</b> over <b>${h} hours</b>. No pump is available, so you will use a <b>standard giving set (20 drops/mL)</b>.`,
      ask:'How many drops per minute? Round to the nearest whole drop.',answer:ex,dp:0,unit:'drops/min',
      steps:[`Time in minutes = ${h} × 60 = <b>${m} minutes</b>`,'Drops/min = volume × drop factor ÷ minutes',`${v} × 20 ÷ ${m} = ${nf(ex)}, so <b>${rd(ex,0)} drops/min</b>`],
      hint:'Change hours into minutes first, then volume × 20 ÷ minutes.',traps:[[v*20/h,'minutes'],[v*15/m,'dropfactor'],[v/m,'missedstep']]});
  }
  if(kid){
    const w=c.weight,a=Math.min(w,10)*100,mid=Math.max(0,Math.min(w,20)-10),b=mid*50,over=Math.max(0,w-20),cc=over*20,tot=a+b+cc,ex=tot/24;
    return Q({fk:'hs',text:`${c.who} weighs <b>${w} kg</b> and needs maintenance IV fluids. Use the Holliday-Segar formula: <b>100 mL/kg/day</b> for the first 10 kg, <b>50 mL/kg/day</b> for the next 10 kg and <b>20 mL/kg/day</b> for each kg above 20 kg.`,
      ask:'What hourly rate should the pump be set to? Round to 1 decimal place.',answer:ex,dp:1,unit:'mL/h',
      steps:[`First 10 kg: 10 × 100 = ${a} mL`,`Next ${mid} kg: ${mid} × 50 = ${b} mL`,`Above 20 kg: ${over} × 20 = ${cc} mL`,`Total per day = <b>${tot} mL</b>`,`Rate = ${tot} ÷ 24 = ${nf(ex)}, so <b>${nfd(ex,1)} mL/h</b>`],
      hint:'Work out the daily total in three chunks, then divide by 24.',traps:[[w*100/24,'missedstep'],[tot/(24*60),'minutes']],alts:[tot/12]});
  }
  const t=R(0,2);
  if(t===0){
    const v=P([250,280,300,320,350]),h=P([2,3,4]),m=h*60,ex=v*15/m;
    return Q({fk:'drops',text:`${c.who} is ${c.place} and is prescribed <b>1 unit of red cells (${v} mL)</b> over <b>${h} hours</b>. You are using a <b>blood giving set (15 drops/mL)</b>.`,
      ask:'How many drops per minute? Round to the nearest whole drop.',answer:ex,dp:0,unit:'drops/min',
      steps:[`Time in minutes = ${h} × 60 = <b>${m} minutes</b>`,'Drops/min = volume × drop factor ÷ minutes',`${v} × 15 ÷ ${m} = ${nf(ex)}, so <b>${rd(ex,0)} drops/min</b>`],
      hint:'Blood sets give 15 drops per mL. Time must be in minutes.',traps:[[v*20/m,'dropfactor'],[v*15/h,'minutes'],[v/m,'missedstep']]});
  }
  if(t===1){
    const v=P([500,750,1000]),r=P([75,100,125,150,250]),ex=v/r;
    return Q({fk:'duration',text:`${c.who} is ${c.place}. A <b>${v} mL bag of ${fl}</b> has just been started at <b>${r} mL/h</b>.`,
      ask:'How long will the bag take to finish, in hours? Round to 1 decimal place.',answer:ex,dp:1,unit:'hours',
      steps:['Time (hours) = volume ÷ rate',`${v} ÷ ${r} = ${nf(ex)}, so <b>${nfd(ex,1)} hours</b>`],note:`That is about ${hm(Math.round(ex*60)/60)}.`,
      hint:'Time = volume ÷ rate.',traps:[[r/v,'inverted']],alts:[ex*60]});
  }
  const r=P([80,100,125,150]),tt=P([2.5,3,4.5,5,6]),used=r*tt,rem=1000-used;
  return Q({fk:'remain',text:`${c.who} is ${c.place}. A <b>1000 mL bag of ${fl}</b> has been running at <b>${r} mL/h</b> for <b>${hm(tt)}</b>.`,
    ask:'How much fluid is left in the bag?',answer:rem,unit:'mL',
    steps:[`Time = ${nf(tt)} hours`,`Volume given = ${r} × ${nf(tt)} = <b>${nf(used)} mL</b>`,`Left = 1000 - ${nf(used)} = <b>${nf(rem)} mL</b>`],
    hint:'Volume given = rate × time. Then take it away from the bag.',traps:[[used,'missedstep'],[1000-r*Math.floor(tt),'minutes']]});
}

/* ================= Fluid balance ================= */
const DRINKS={adult:[['Cup of tea',200],['Glass of water',250],['Orange juice',150],['Soup',200],['Water from jug',300]],
  child:[['Beaker of milk',120],['Cup of squash',150],['Yoghurt drink',100],['Water bottle',200]],
  mh:[['Mug of coffee',250],['Glass of water',250],['Can of fizzy drink',330],['Cup of tea',200]],
  ld:[['Beaker of thickened juice',150],['Thickened tea',200],['Glass of water',250],['Smoothie',150]]};
const TIMES=['07:00','09:00','10:30','12:00','13:30','15:00','16:30','18:00','19:30','21:00'];
function pickTimes(n){return [...TIMES].sort(()=>Math.random()-.5).slice(0,n).sort();}
function table(title,rows,tot){
  return `<table class="fc"><tr><th colspan="3">${title}</th></tr>${rows.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td><td class="n">${typeof r[2]==='number'?nf(r[2])+' mL':r[2]}</td></tr>`).join('')}${tot?`<tr><th colspan="2">Total</th><th class="n">${tot}</th></tr>`:''}</table>`;
}
function urineVals(n,kid){return Array.from({length:n},()=>kid?R(5,15)*10:R(15,45)*10);}
function genBal(L,f){
  const kid=f==='child',c=ctx(f,L>=3);
  if(L===1){
    if(Math.random()<0.5){
      const n=R(3,4),t=pickTimes(n),d=Array.from({length:n},()=>P(DRINKS[f])),tot=sum(d.map(x=>x[1]));
      return Q({fk:'total',text:`${c.who} is ${c.place}. Here is their oral intake so far today:${table('Oral intake',d.map((x,i)=>[t[i],x[0],x[1]]))}`,
        ask:'What is the total oral intake?',answer:tot,unit:'mL',
        steps:['Add every entry together.',`${d.map(x=>x[1]).join(' + ')} = <b>${nf(tot)} mL</b>`],hint:'Add them two at a time if it helps.',traps:[[tot-d[0][1],'missedstep']],alts:[tot+100]});
    }
    const n=R(3,4),t=pickTimes(n),u=urineVals(n,kid),tot=sum(u);
    return Q({fk:'total',text:`${c.who} is ${c.place}. Here is their urine output so far today:${table('Output',u.map((x,i)=>[t[i],'Urine',x]))}`,
      ask:'What is the total urine output?',answer:tot,unit:'mL',
      steps:['Add every entry together.',`${u.join(' + ')} = <b>${nf(tot)} mL</b>`],hint:'Add them two at a time if it helps.',traps:[[tot-u[0],'missedstep']],alts:[tot+100]});
  }
  if(L===2){
    if(kid&&Math.random()<0.5){
      const n=3,dry=P([20,25,30]),wet=Array.from({length:n},()=>dry+R(4,9)*10),tot=sum(wet)-n*dry;
      return Q({fk:'nappy',text:`${c.who} is ${c.place} and wears nappies. Three wet nappies weighed <b>${andList(wet.map(x=>x+' g'))}</b>. A dry nappy weighs <b>${dry} g</b>. Take 1 g as 1 mL of urine.`,
        ask:'What is the total urine output?',answer:tot,unit:'mL',
        steps:[`Total weight of wet nappies = ${wet.join(' + ')} = ${sum(wet)} g`,`Weight of 3 dry nappies = 3 × ${dry} = ${3*dry} g`,`Urine = ${sum(wet)} - ${3*dry} = <b>${tot} mL</b>`],
        hint:'Take the dry nappy weight away from each wet nappy.',traps:[[sum(wet),'missedstep'],[sum(wet)-dry,'missedstep']]});
    }
    const n=R(3,4),t=pickTimes(n),d=Array.from({length:n},()=>P(DRINKS[f])),inn=sum(d.map(x=>x[1]));
    const m=R(2,3),t2=pickTimes(m),u=urineVals(m,kid).map(x=>x+(kid?0:R(0,1)*100)),out=sum(u),bal=inn-out;
    return Q({fk:'balance',signed:true,text:`${c.who} is ${c.place}. Here is part of their fluid balance chart:${table('Intake',d.map((x,i)=>[t[i],x[0],x[1]]))}${table('Output',u.map((x,i)=>[t2[i],'Urine',x]))}`,
      ask:'What is the fluid balance? Use a minus sign if it is negative.',answer:bal,unit:'mL',
      steps:[`Total in = ${d.map(x=>x[1]).join(' + ')} = <b>${nf(inn)} mL</b>`,`Total out = ${u.join(' + ')} = <b>${nf(out)} mL</b>`,`Balance = in - out = ${nf(inn)} - ${nf(out)} = <b>${sgn(bal)} mL</b>`],
      note:bal>=0?'Positive: more has gone in than come out.':'Negative: more has come out than gone in.',
      hint:'Total IN, total OUT, then IN minus OUT.',traps:[[inn+out,'calc']]});
  }
  if(L===3){
    const r=kid?P([30,40,50]):P([75,80,100,125]),h=P([4,6,8,12]),iv=r*h;
    const d=Array.from({length:2},()=>P(DRINKS[f])),t=pickTimes(2),oral=sum(d.map(x=>x[1])),inn=iv+oral;
    const u=urineVals(3,kid),t2=pickTimes(4);
    const extraName=f==='adult'?'Wound drain':'Vomit',extra=kid?R(3,10)*10:(f==='adult'?R(2,15)*10:R(5,20)*10);
    const out=sum(u)+extra,bal=inn-out;
    return Q({fk:'balance',signed:true,text:`${c.who} is ${c.place}. IV fluid has been running at <b>${r} mL/h for ${h} hours</b>. They have also had:${table('Oral intake',d.map((x,i)=>[t[i],x[0],x[1]]))}${table('Output',[...u.map((x,i)=>[t2[i],'Urine',x]),[t2[3],extraName,extra]])}`,
      ask:'What is the fluid balance for this period? Use a minus sign if it is negative.',answer:bal,unit:'mL',
      steps:[`IV in = ${r} × ${h} = <b>${nf(iv)} mL</b>`,`Total in = ${nf(iv)} + ${d.map(x=>x[1]).join(' + ')} = <b>${nf(inn)} mL</b>`,`Total out = ${[...u,extra].join(' + ')} = <b>${nf(out)} mL</b>`,`Balance = ${nf(inn)} - ${nf(out)} = <b>${sgn(bal)} mL</b>`],
      hint:'Do not forget the IV fluid: rate × hours.',traps:[[oral-out,'missedstep'],[inn-sum(u),'missedstep']]});
  }
  const w=kid?c.weight:P([50,60,65,70,75,80,90]),h=P([4,6,8]),rate=kid?P([0.5,0.8,1,1.5,2]):P([0.3,0.4,0.5,0.6,0.8,1]),urine=Math.round(rate*w*h),min=kid?1:0.5;
  return Q({fk:'urine',text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. Over the last <b>${h} hours</b> they have passed <b>${urine} mL</b> of urine.`,
    ask:'What is their urine output in mL/kg/h? Round to 1 decimal place.',answer:urine/w/h,dp:1,unit:'mL/kg/h',
    steps:[`Per hour: ${urine} ÷ ${h} = ${nf(urine/h)} mL/h`,`Per kg: ${nf(urine/h)} ÷ ${w} = ${nf(urine/w/h)}, so <b>${nfd(urine/w/h,1)} mL/kg/h</b>`],
    note:rate>=min?`This meets the commonly used minimum of ${min} mL/kg/h.`:`This is <b>below</b> the commonly used minimum of ${min} mL/kg/h, so escalate to the nurse in charge or medical team.`,
    hint:'Urine ÷ hours, then ÷ weight.',traps:[[urine/h,'missedstep'],[urine/w,'missedstep']]});
}

/* ================= Missing value ================= */
function genMiss(L,f){
  const kid=f==='child';
  if(L===1){
    const c=ctx(f,true);
    if(Math.random()<0.5){
      const r=kid?P([20,30,40,50]):P([50,75,100,125]),h=P([2,3,4,6,8]),v=r*h;
      return Q({fk:'volume',text:`${c.who} is ${c.place}. Their IV fluid has been running at <b>${r} mL/h</b> for <b>${h} hours</b>. The total volume has not been filled in yet.`,
        ask:'How much fluid has been given?',answer:v,unit:'mL',steps:['Volume = rate × time',`${r} × ${h} = <b>${nf(v)} mL</b>`],hint:'Volume = rate × time',traps:[[r/h,'inverted']],alts:[v/2]});
    }
    const c2=ctx(f),d=Array.from({length:3},()=>P(DRINKS[f])),t=pickTimes(3),tot=sum(d.map(x=>x[1])),miss=d[2][1];
    return Q({fk:'missingEntry',text:`${c2.who} is ${c2.place}. Their chart shows a total oral intake of <b>${nf(tot)} mL</b>, but one entry is smudged:${table('Oral intake',[[t[0],d[0][0],d[0][1]],[t[1],d[1][0],d[1][1]],[t[2],d[2][0],'?']],nf(tot)+' mL')}`,
      ask:'What volume is missing?',answer:miss,unit:'mL',
      steps:[`Known entries = ${d[0][1]} + ${d[1][1]} = ${d[0][1]+d[1][1]} mL`,`Missing = ${nf(tot)} - ${d[0][1]+d[1][1]} = <b>${miss} mL</b>`],hint:'Total minus the entries you know.',alts:[tot,miss+50]});
  }
  if(L===2){
    if(Math.random()<0.5){
      const c=ctx(f,true),[v,r]=P(kid?[[500,50],[250,25],[480,40],[360,30]]:[[1000,125],[500,125],[1000,100],[500,50],[1000,250],[750,125]]),h=v/r;
      return Q({fk:'duration',text:`${c.who} is ${c.place}. A <b>${v} mL</b> bag is running at <b>${r} mL/h</b>.`,ask:'How many hours will it take to finish?',answer:h,unit:'hours',
        steps:['Time = volume ÷ rate',`${v} ÷ ${r} = <b>${nf(h)} hours</b>`],hint:'Time = volume ÷ rate',traps:[[r/v,'inverted'],[h*60,'unitAsked']]});
    }
    const c=ctx(f),b=(Math.random()<0.5?1:-1)*R(1,8)*50,out=kid?R(6,12)*100:R(12,24)*100,inn=out+b;
    return Q({fk:'intake',text:`${c.who} is ${c.place}. Their 24 hour fluid balance is <b>${sgn(b)} mL</b>. The total output was <b>${nf(out)} mL</b>. The total intake box is blank.`,
      ask:'What was the total intake?',answer:inn,unit:'mL',
      steps:['Balance = in - out, so in = out + balance',`In = ${nf(out)} + (${sgn(b)}) = <b>${nf(inn)} mL</b>`],hint:'Rearrange: intake = output + balance',traps:[[out-b,'sign']],alts:[out]});
  }
  if(L===3){
    if(Math.random()<0.5){
      const c=f==='child'?teen():ctx(f),b=R(185,350)/10,hcm=R(150,190),h=hcm/100,h2=rd(h*h,4),w=b*h2;
      return Q({fk:'bmiRev',text:`${c.who} has a recorded BMI of <b>${nf(b)}</b> and is <b>${hcm} cm</b> tall, but their weight is missing from the record.`,
        ask:'What do they weigh? Round to 1 decimal place.',answer:w,dp:1,unit:'kg',
        steps:['BMI = weight ÷ height², so weight = BMI × height²',`Height = ${hcm} ÷ 100 = ${nf(h)} m, height² = ${nf(h2)}`,`Weight = ${nf(b)} × ${nf(h2)} = ${nf(w)}, so <b>${nfd(w,1)} kg</b>`],
        hint:'Rearrange BMI: weight = BMI × height (m)²',traps:[[b*h,'nosquare'],[b/h2,'inverted']]});
    }
    const c=ctx(f),pool=WG[f][2].map(norm).filter(e=>e.out==='mL'),e=P(pool),d=P(e.d.filter(x=>!Array.isArray(x))),vol=d/e.st*e.v,per=e.st/e.v;
    return Q({fk:'doseFromVol',drug:e.n,text:`${c.who} is ${c.place}. During a second check, your colleague asks you to confirm the dose in <b>${nf(vol)} mL</b> of <b>${e.n} ${e.s}</b>.`,
      ask:'What dose is in that volume (in mg)?',answer:d,unit:'mg',
      steps:[`Strength per mL = ${nf(e.st)} ÷ ${nf(e.v)} = <b>${nf(per)} mg/mL</b>`,`Dose = ${nf(vol)} mL × ${nf(per)} = <b>${nf(d)} mg</b>`],hint:'Work out how many mg are in 1 mL first.',traps:[[vol*e.st,'missedstep'],[vol/e.st*e.v,'inverted']],alts:[d*2]});
  }
  const t=f==='mh'?1:R(0,1);
  if(t===0){
    if(f==='child'){
      const c=ctx('child'),w=c.weight,mg=15*w;
      return Q({fk:'weightFromDose',drug:'Paracetamol',text:`${c.who} is ${c.place}. They are prescribed <b>paracetamol 15 mg/kg</b> and the calculated dose on the chart is <b>${mg} mg</b>, but the weight box is empty.`,
        ask:'What weight was used?',answer:w,unit:'kg',steps:['Dose = mg/kg × weight, so weight = dose ÷ mg/kg',`${mg} ÷ 15 = <b>${w} kg</b>`],hint:'Weight = dose ÷ dose per kg',traps:[[mg*15,'inverted']],alts:[w*2,mg/10]});
    }
    if(f==='adult'){
      const c=ctx('adult',true),w=R(36,49),mg=15*w;
      return Q({fk:'weightFromDose',drug:'Paracetamol',text:`${c.who} is ${c.place}. They are prescribed <b>IV paracetamol 15 mg/kg</b> and the calculated dose is <b>${mg} mg</b>, but the weight is not recorded.`,
        ask:'What weight was used?',answer:w,unit:'kg',steps:['Weight = dose ÷ mg/kg',`${mg} ÷ 15 = <b>${w} kg</b>`],hint:'Weight = dose ÷ dose per kg',traps:[[mg*15,'inverted']],alts:[mg/10,w*2]});
    }
    const c=ctx('ld'),w=P([50,55,60,65,70,75,80]),daily=20*w;
    return Q({fk:'weightFromDose',drug:'Sodium valproate',text:`${c.who} is ${c.place}. They take <b>sodium valproate 20 mg/kg/day</b>, which works out as <b>${nf(daily)} mg per day</b>. Their weight is missing from the MAR chart.`,
      ask:'What weight was used?',answer:w,unit:'kg',steps:['Weight = daily dose ÷ mg/kg/day',`${nf(daily)} ÷ 20 = <b>${w} kg</b>`],hint:'Weight = dose ÷ dose per kg',traps:[[daily*20,'inverted']],alts:[daily/10,w*2]});
  }
  const c=ctx(f,true),fl=P(FLUID[f]),bag=kid?500:1000,r=kid?P([40,50,60]):P([80,100,125]),ran=P([2,3,4]),left=P([4,5,6]),rem=bag-r*ran,nr=rem/left;
  return Q({fk:'newrate',text:`${c.who} is ${c.place}. A <b>${bag} mL bag of ${fl}</b> ran at <b>${r} mL/h for ${ran} hours</b>, then the pump was paused. The prescriber wants the rest of the bag to run over the next <b>${left} hours</b>.`,
    ask:'What new rate is needed? Round to 1 decimal place.',answer:nr,dp:1,unit:'mL/h',
    steps:[`Already given = ${r} × ${ran} = ${r*ran} mL`,`Left in bag = ${bag} - ${r*ran} = <b>${rem} mL</b>`,`New rate = ${rem} ÷ ${left} = ${nf(nr)}, so <b>${nfd(nr,1)} mL/h</b>`],
    hint:'Find what is left in the bag, then divide by the hours remaining.',traps:[[bag/left,'missedstep'],[rem/ran,'calc']]});
}

/* ================= BNF max dose checks ================= */
function bnfBox(title,lines,child){
  return `<div class="bnfx"><div class="bnfh">${child?'BNFC':'BNF'}-style reference: ${title} <span>(simplified for practice)</span></div>${lines.map(l=>`<div class="bl">• ${l}</div>`).join('')}</div>`;
}
const DT=['06:00','10:00','14:00','18:00'];
const gmg=d=>d>=1000?nf(d/1000)+' g':nf(d)+' mg';
function givenText(doses,fmt){return andList(doses.map((d,i)=>`${fmt(d)} at ${DT[i]}`));}
function genBNF(L,f){
  const c=ctx(f);
  if(f==='adult'||(f==='ld'&&Math.random()<0.4)){
    const kind=f==='ld'?'paraLiq':(L===1?P(['para','cod']):L===2?P(['para','cod']):L===3?P(['para','cod','ibu']):P(['para','ibu']));
    if(kind==='para'||kind==='paraLiq'){
      const box=bnfBox('Paracetamol (oral), adults',['Dose: 0.5 to 1 g every 4 to 6 hours','<b>Maximum 4 g in 24 hours</b>']);
      const n=L===1?2:3,doses=L===1?[1000,1000]:Array.from({length:n},()=>P([500,1000])),given=sum(doses),left=4000-given;
      if(kind==='paraLiq'){
        const toMl=d=>d/250*5;
        if(L>=4||(L===3)){
          const ml=left/250*5;
          return Q({fk:'maxdose',drug:'Paracetamol',text:`${c.who} is ${c.place} and has paracetamol oral suspension <b>250 mg in 5 mL</b>. In the last 24 hours they have had ${givenText(doses,d=>`<b>${nf(toMl(d))} mL</b>`)}.${box}`,
            ask:'What volume of suspension could still be given before reaching the 24 hour maximum?',answer:ml,unit:'mL',
            steps:[`Given in mL: ${doses.map(toMl).join(' + ')} = ${sum(doses.map(toMl))} mL, which is ${sum(doses.map(toMl))} ÷ 5 × 250 = <b>${given} mg</b>`,`Maximum 4 g = 4000 mg, so ${4000} - ${given} = <b>${left} mg</b> left`,`Volume: ${left} ÷ 250 × 5 = <b>${nf(ml)} mL</b>`],
            hint:'Turn the mL given into mg, take it from the maximum, then turn what is left back into mL.',traps:[[left,'unitAsked'],[(4000/250*5)-sum(doses),'calc']]});
        }
      }
      if(L<=2) return Q({fk:'maxdose',drug:'Paracetamol',text:`${c.who} is ${c.place}. In the last 24 hours they have had paracetamol ${givenText(doses,d=>`<b>${gmg(d)}</b>`)}.${box}`,
        ask:'How much more paracetamol (in mg) could be given before reaching the 24 hour maximum?',answer:left,unit:'mg',
        steps:['Maximum = 4 g = <b>4000 mg</b>',`Given = ${doses.join(' + ')} = <b>${given} mg</b>`,`Left = 4000 - ${given} = <b>${left} mg</b>`],
        hint:'Change the maximum into mg, add up what has been given, then subtract.',traps:[[4-given/1000,'noconv'],[4000+given,'calc']]});
      if(L===3) return Q({fk:'maxdose',drug:'Paracetamol',text:`${c.who} is ${c.place}. In the last 24 hours they have had paracetamol ${givenText(doses,d=>`<b>${gmg(d)}</b>`)}. You have <b>paracetamol 500 mg tablets</b>.${box}`,
        ask:'How many 500 mg tablets would take them up to the 24 hour maximum?',answer:left/500,unit:'tablets',
        steps:['Maximum = 4 g = <b>4000 mg</b>',`Given = ${doses.join(' + ')} = <b>${given} mg</b>`,`Left = 4000 - ${given} = ${left} mg`,`Tablets = ${left} ÷ 500 = <b>${left/500} tablets</b>`],
        hint:'Find what is left in mg, then divide by the tablet strength.',traps:[[left,'unitAsked'],[given/500,'missedstep']]});
      return Q({fk:'maxdose',drug:'Paracetamol',text:`${c.who} is ${c.place}. In the last 24 hours they have had paracetamol ${givenText(doses,d=>`<b>${gmg(d)}</b>`)}.${box}`,
        ask:'How much more paracetamol could be given before the 24 hour maximum? Answer in grams.',answer:left/1000,unit:'g',
        steps:[`Given = ${doses.join(' + ')} = ${given} mg = <b>${nf(given/1000)} g</b>`,`Left = 4 - ${nf(given/1000)} = <b>${nf(left/1000)} g</b>`],
        hint:'Work in grams: change every dose into g first.',traps:[[left,'unitAsked']]});
    }
    if(kind==='cod'){
      const box=bnfBox('Codeine phosphate (oral), adults',['Dose: 30 to 60 mg every 4 hours when necessary','<b>Maximum 240 mg per day</b>']);
      const doses=L===1?[60,60]:Array.from({length:3},()=>P([30,60])),given=sum(doses),left=240-given;
      if(L<=2) return Q({fk:'maxdose',drug:'Codeine phosphate',text:`${c.who} is ${c.place}. Today they have had codeine phosphate ${givenText(doses,d=>`<b>${d} mg</b>`)}.${box}`,
        ask:'How much more codeine (in mg) could be given today?',answer:left,unit:'mg',
        steps:[`Given = ${doses.join(' + ')} = <b>${given} mg</b>`,`Left = 240 - ${given} = <b>${left} mg</b>`],hint:'Maximum minus what has been given.',traps:[[240+given,'calc']]});
      return Q({fk:'maxdose',drug:'Codeine phosphate',text:`${c.who} is ${c.place}. Today they have had codeine phosphate ${givenText(doses,d=>`<b>${d} mg</b>`)}. You have <b>codeine phosphate 30 mg tablets</b>.${box}`,
        ask:'How many more 30 mg tablets could be given today without going over the maximum?',answer:left/30,unit:'tablets',
        steps:[`Given = ${doses.join(' + ')} = <b>${given} mg</b>`,`Left = 240 - ${given} = ${left} mg`,`Tablets = ${left} ÷ 30 = <b>${left/30} tablets</b>`],hint:'Find what is left in mg, then divide by 30.',traps:[[left,'unitAsked']]});
    }
    const box=bnfBox('Ibuprofen (oral), adults',['Dose: 300 to 400 mg 3 to 4 times a day','<b>Maximum 2.4 g per day</b>']);
    const [d,n]=P([[400,3],[200,3],[400,4],[200,4]]),daily=d*n,left=2400-daily;
    if(L===3) return Q({fk:'maxdose',drug:'Ibuprofen',text:`${c.who} is ${c.place} and takes <b>ibuprofen ${d} mg ${n===3?'three':'four'} times a day</b>.${box}`,
      ask:'How many more mg per day could be given before reaching the maximum?',answer:left,unit:'mg',
      steps:['Maximum = 2.4 g = <b>2400 mg</b>',`Current daily dose = ${d} × ${n} = <b>${daily} mg</b>`,`Left = 2400 - ${daily} = <b>${left} mg</b>`],hint:'Change 2.4 g into mg first.',traps:[[2.4-daily,'noconv'],[2400-d,'missedstep']]});
    return Q({fk:'maxdose',drug:'Ibuprofen',text:`${c.who} is ${c.place} and takes <b>ibuprofen ${d} mg ${n===3?'three':'four'} times a day</b>. You have <b>ibuprofen 200 mg tablets</b>.${box}`,
      ask:'How many extra 200 mg tablets per day would take them to the maximum?',answer:left/200,unit:'tablets',
      steps:['Maximum = 2.4 g = <b>2400 mg</b>',`Current daily dose = ${d} × ${n} = <b>${daily} mg</b>`,`Left = 2400 - ${daily} = ${left} mg`,`Tablets = ${left} ÷ 200 = <b>${left/200} tablets</b>`],hint:'mg left ÷ tablet strength.',traps:[[left,'unitAsked'],[2400/200,'missedstep']]});
  }
  if(f==='child'){
    const w=c.weight,box=bnfBox('Ibuprofen (oral), child',['Dose: 5 to 10 mg/kg 3 to 4 times a day','<b>Maximum 30 mg/kg per day</b>'],true),max=30*w,dose=5*w,ml=dose/100*5;
    if(L===1) return Q({fk:'maxdose',drug:'Ibuprofen',child:true,text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>.${box}`,
      ask:'What is the maximum amount of ibuprofen they can have in one day (in mg)?',answer:max,unit:'mg',
      steps:[`Maximum = 30 mg × ${w} kg = <b>${max} mg</b>`],hint:'Maximum per kg × weight.',traps:[[10*w,'missedstep'],[30+w,'calc']]});
    if(L===2) return Q({fk:'maxdose',drug:'Ibuprofen',child:true,text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. Today they have had two doses of <b>${dose} mg</b> ibuprofen.${box}`,
      ask:'How much more ibuprofen (in mg) could be given today?',answer:max-2*dose,unit:'mg',
      steps:[`Maximum = 30 × ${w} = <b>${max} mg</b>`,`Given = 2 × ${dose} = <b>${2*dose} mg</b>`,`Left = ${max} - ${2*dose} = <b>${max-2*dose} mg</b>`],hint:'Work out the daily maximum, then subtract what has been given.',traps:[[max-dose,'missedstep'],[max,'missedstep']]});
    if(L===3) return Q({fk:'maxdose',drug:'Ibuprofen',child:true,text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. Today they have had three doses of <b>${nf(ml)} mL</b> of ibuprofen oral suspension <b>100 mg in 5 mL</b>.${box}`,
      ask:'How much more ibuprofen (in mg) could be given today?',answer:max-3*dose,unit:'mg',
      steps:[`Each dose = ${nf(ml)} ÷ 5 × 100 = <b>${dose} mg</b>`,`Given = 3 × ${dose} = <b>${3*dose} mg</b>`,`Maximum = 30 × ${w} = <b>${max} mg</b>`,`Left = ${max} - ${3*dose} = <b>${max-3*dose} mg</b>`],hint:'Turn mL into mg first.',traps:[[max-3*ml,'missedstep'],[max,'missedstep']]});
    const left=max-3*dose,lml=left/100*5;
    return Q({fk:'maxdose',drug:'Ibuprofen',child:true,text:`${c.who} is ${c.place} and weighs <b>${w} kg</b>. Today they have had three doses of <b>${dose} mg</b> ibuprofen. You have ibuprofen oral suspension <b>100 mg in 5 mL</b>.${box}`,
      ask:'What volume of suspension could still be given today before reaching the maximum?',answer:lml,unit:'mL',
      steps:[`Maximum = 30 × ${w} = <b>${max} mg</b>`,`Given = 3 × ${dose} = <b>${3*dose} mg</b>`,`Left = ${max} - ${3*dose} = ${left} mg`,`Volume = ${left} ÷ 100 × 5 = <b>${nf(lml)} mL</b>`],hint:'Find the mg left, then use Want ÷ Got × In.',traps:[[left,'unitAsked'],[max/100*5,'missedstep']]});
  }
  if(f==='mh'){
    const pick=L===1?P(['sert','olz']):L===2?P(['sert','olz','quet']):L===3?P(['sert','olz','quet']):P(['sert','olz']);
    if(pick==='sert'){
      const box=bnfBox('Sertraline, adults (depression)',['Initially 50 mg once daily','Increase in steps of 50 mg, at least 1 week apart','<b>Maximum 200 mg per day</b>']);
      const D=P([50,100,150]);
      if(L===1) return Q({fk:'maxdose',drug:'Sertraline',text:`${c.who} is ${c.place} and takes <b>sertraline ${D} mg once daily</b>.${box}`,
        ask:'By how many mg could the daily dose still be increased?',answer:200-D,unit:'mg',steps:[`200 - ${D} = <b>${200-D} mg</b>`],hint:'Maximum minus current dose.',traps:[[200+D,'calc']]});
      if(L===2) return Q({fk:'maxdose',drug:'Sertraline',text:`${c.who} is ${c.place} and takes sertraline. The team are discussing the maximum dose. You have <b>sertraline 50 mg tablets</b>.${box}`,
        ask:'At the maximum daily dose, how many 50 mg tablets would be taken each day?',answer:4,unit:'tablets',steps:['Maximum = 200 mg per day',`200 ÷ 50 = <b>4 tablets</b>`],hint:'Maximum ÷ tablet strength.',traps:[[200,'unitAsked']]});
      if(L===3){const g=D/1000;return Q({fk:'maxdose',drug:'Sertraline',text:`${c.who} is ${c.place}. Their chart says <b>sertraline ${nf(g)} g once daily</b>.${box}`,
        ask:'By how many mg could the daily dose still be increased?',answer:200-D,unit:'mg',steps:[`${nf(g)} g × 1000 = <b>${D} mg</b>`,`200 - ${D} = <b>${200-D} mg</b>`],hint:'Change grams into mg first.',traps:[[200-g,'noconv']]});}
      const nd=D+50,days=P([14,28]),tabs=nd/50*days;
      return Q({fk:'maxdose',drug:'Sertraline',text:`${c.who} is ${c.place} and takes <b>sertraline ${D} mg once daily</b>. The prescriber increases it by one 50 mg step. You have <b>sertraline 50 mg tablets</b>.${box}`,
        ask:`How many tablets are needed for ${days} days at the new dose?`,answer:tabs,unit:'tablets',steps:[`New dose = ${D} + 50 = <b>${nd} mg</b> (still within 200 mg)`,`Tablets per day = ${nd} ÷ 50 = ${nd/50}`,`For ${days} days: ${nd/50} × ${days} = <b>${tabs} tablets</b>`],hint:'New dose, then tablets per day, then × days.',traps:[[D/50*days,'missedstep'],[nd/50,'missedstep']]});
    }
    if(pick==='olz'){
      const box=bnfBox('Olanzapine, adults',['Usual range 5 to 20 mg daily','<b>Maximum 20 mg in 24 hours</b> (regular and when-required doses added together)']);
      const reg=P([10,15]);
      if(L===1) return Q({fk:'maxdose',drug:'Olanzapine',text:`${c.who} is ${c.place} and takes <b>olanzapine ${reg} mg</b> regularly. They are also prescribed olanzapine when required.${box}`,
        ask:'What is the most olanzapine (in mg) that could be given when required in 24 hours?',answer:20-reg,unit:'mg',steps:[`20 - ${reg} = <b>${20-reg} mg</b>`],hint:'Maximum minus regular dose.',traps:[[20,'missedstep']]});
      if(L===2) return Q({fk:'maxdose',drug:'Olanzapine',text:`${c.who} is ${c.place} and takes <b>olanzapine ${reg} mg</b> regularly. When-required olanzapine comes as <b>5 mg tablets</b>.${box}`,
        ask:'How many 5 mg when-required tablets could be given in 24 hours at most?',answer:(20-reg)/5,unit:'tablets',steps:[`Room left = 20 - ${reg} = <b>${20-reg} mg</b>`,`${20-reg} ÷ 5 = <b>${(20-reg)/5} tablets</b>`],hint:'Room left ÷ tablet strength.',traps:[[20-reg,'unitAsked'],[4,'missedstep']]});
      if(L===3) return Q({fk:'maxdose',drug:'Olanzapine',text:`${c.who} is ${c.place} and takes <b>olanzapine ${reg} mg</b> regularly. When-required olanzapine comes as <b>2.5 mg tablets</b>.${box}`,
        ask:'How many 2.5 mg when-required tablets could be given in 24 hours at most?',answer:(20-reg)/2.5,unit:'tablets',steps:[`Room left = 20 - ${reg} = <b>${20-reg} mg</b>`,`${20-reg} ÷ 2.5 = <b>${(20-reg)/2.5} tablets</b>`],hint:'Room left ÷ tablet strength.',traps:[[20-reg,'unitAsked']]});
      const prn=P([2.5,5]),left=20-10-prn;
      return Q({fk:'maxdose',drug:'Olanzapine',text:`${c.who} is ${c.place}. They take <b>olanzapine 10 mg</b> regularly and have already had <b>${nf(prn)} mg</b> when required today. More when-required olanzapine comes as <b>2.5 mg tablets</b>.${box}`,
        ask:'How many more 2.5 mg tablets could be given in this 24 hours?',answer:left/2.5,unit:'tablets',steps:[`Given so far = 10 + ${nf(prn)} = <b>${nf(10+prn)} mg</b>`,`Room left = 20 - ${nf(10+prn)} = ${nf(left)} mg`,`${nf(left)} ÷ 2.5 = <b>${nf(left/2.5)} tablets</b>`],hint:'Add up everything given, take it from 20 mg, then divide by 2.5.',traps:[[10/2.5,'missedstep'],[left,'unitAsked']]});
    }
    const box=bnfBox('Quetiapine, adults (schizophrenia)',['Usually 300 to 450 mg daily in 2 divided doses','<b>Maximum 750 mg per day</b>']);
    const x=P([200,250,300]),left=750-2*x;
    return Q({fk:'maxdose',drug:'Quetiapine',text:`${c.who} is ${c.place} and takes <b>quetiapine ${x} mg twice daily</b>.${box}`,
      ask:'How many more mg per day could be prescribed before reaching the maximum?',answer:left,unit:'mg',steps:[`Daily dose = ${x} × 2 = <b>${2*x} mg</b>`,`Left = 750 - ${2*x} = <b>${left} mg</b>`],hint:'Twice daily means × 2.',traps:[[750-x,'missedstep']]});
  }
  // ld levetiracetam
  const box=bnfBox('Levetiracetam, adults (epilepsy)',['Initially 250 to 500 mg twice daily','Can be increased up to a <b>maximum of 1.5 g twice daily</b>']);
  const D=P([500,750,1000]);
  if(L===1) return Q({fk:'maxdose',drug:'Levetiracetam',text:`${c.who} is ${c.place} and takes <b>levetiracetam ${D} mg twice daily</b>.${box}`,
    ask:'By how many mg could each dose still be increased?',answer:1500-D,unit:'mg',steps:['Maximum each dose = 1.5 g = <b>1500 mg</b>',`1500 - ${D} = <b>${1500-D} mg</b>`],hint:'Change 1.5 g into mg, then subtract.',traps:[[1.5-D,'noconv'],[3000-2*D,'missedstep']]});
  if(L===2) return Q({fk:'maxdose',drug:'Levetiracetam',text:`${c.who} is ${c.place} and takes <b>levetiracetam ${D} mg twice daily</b>.${box}`,
    ask:'How many more mg per day could be given before reaching the daily maximum?',answer:3000-2*D,unit:'mg',steps:['Maximum per day = 1500 × 2 = <b>3000 mg</b>',`Current per day = ${D} × 2 = <b>${2*D} mg</b>`,`Left = 3000 - ${2*D} = <b>${3000-2*D} mg</b>`],hint:'Twice daily means × 2 for both the maximum and the current dose.',traps:[[1500-D,'missedstep']]});
  const shown=L===4?nf(D/1000)+' g':D+' mg',ml=(1500-D)/100;
  return Q({fk:'maxdose',drug:'Levetiracetam',text:`${c.who} is ${c.place} and takes <b>levetiracetam ${shown} twice daily</b> as oral solution <b>100 mg/mL</b>.${box}`,
    ask:'By how many mL could each dose still be increased before reaching the maximum?',answer:ml,unit:'mL',
    steps:[...(L===4?[`${shown} × 1000 = <b>${D} mg</b>`]:[]),`Room per dose = 1500 - ${D} = <b>${1500-D} mg</b>`,`Volume = ${1500-D} ÷ 100 × 1 = <b>${nf(ml)} mL</b>`],hint:'Find the mg room per dose, then turn it into mL.',traps:[[1500-D,'unitAsked'],[(3000-2*D)/100,'missedstep']]});
}

const TOPICS={
  bmi:{label:'BMI',icon:'',color:'#7B5CF0',gen:genBMI},
  conv:{label:'Conversions',icon:'',color:'#12A3B8',gen:genConv},
  wig:{label:'WIG formula',icon:'',color:'#F2547D',gen:genWIG},
  flow:{label:'Flow rates',icon:'',color:'#2D5BE3',gen:genFlow},
  bal:{label:'Fluid balance',icon:'',color:'#22A06B',gen:genBal},
  miss:{label:'Missing value',icon:'',color:'#F2A516',gen:genMiss},
  bnf:{label:'BNF maximum doses',icon:'',color:'#0E8A55',gen:genBNF}
};
const LEVELS=[null,{label:'Simple',color:'#22A06B',pts:10},{label:'Moderate',color:'#F2A516',pts:20},{label:'Difficult',color:'#FF6B3D',pts:30},{label:'Hard',color:'#E0294A',pts:50}];
function makeQFor(L,f,t){const q=TOPICS[t].gen(L,f);q.topic=t;q.field=f;q.level=L;if(f==='child'&&q.drug)q.child=true;return q;}

/* ================= units ================= */
const UNIT_ALIASES={
  'tablets':['tablet','tablets','tab','tabs','tablet(s)','tabs.'],
  'mL':['ml','mls','millilitre','millilitres','milliliter','milliliters'],
  'mL/h':['ml/h','ml/hr','ml/hrs','ml/hour','ml/hours','mls/h','mls/hr','mls/hour','millilitres/hour','millilitre/hour','ml/hourly'],
  'drops/min':['drops/min','drops/mins','drops/minute','drops/minutes','drop/min','drop/minute','gtt/min','gtts/min','dpm'],
  'kg/m²':['kg/m2','kgm2','kg/m^2','kg/msq','kg/sqm'],
  'kg':['kg','kgs','kilogram','kilograms','kilo','kilos'],
  'cm':['cm','cms','centimetre','centimetres','centimeter','centimeters'],
  'g':['g','gram','grams','gm','gms','gs'],
  'mg':['mg','mgs','milligram','milligrams'],
  'micrograms':['micrograms','microgram'],
  'L':['l','litre','litres','liter','liters','ltr','ltrs'],
  'hours':['h','hr','hrs','hour','hours'],
  'minutes':['min','mins','minute','minutes'],
  'mL/kg/h':['ml/kg/h','ml/kg/hr','ml/kg/hour','mls/kg/h','mls/kg/hr','ml/kg/hrs']
};
const UNIT_MAP={};Object.entries(UNIT_ALIASES).forEach(([k,a])=>a.forEach(x=>UNIT_MAP[x]=k));
const BANNED={mcg:'mcg',mcgs:'mcg',ug:'mcg','µg':'mcg','μg':'mcg',cc:'cc',ccs:'cc'};
function normUnit(s){return s.toLowerCase().replace(/\s+/g,'').replace(/²/g,'2').replace(/\bper\b/g,'/').replace(/per/g,'/').replace(/\.$/,'');}
function matchUnit(rest){
  if(!rest) return {kind:'none'};
  const raw=rest.trim();const n0=raw.toLowerCase().replace(/\s+/g,'');
  if(BANNED[n0]) return {kind:'banned',why:BANNED[n0],raw};
  const n=normUnit(raw);
  if(BANNED[n]) return {kind:'banned',why:BANNED[n],raw};
  if(UNIT_MAP[n]) return {kind:'ok',canon:UNIT_MAP[n],raw};
  return {kind:'unknown',raw};
}
function parseFull(raw){
  if(raw==null) return null;
  let s=String(raw).trim().replace(/,/g,'').replace(/[\u2212\u2013\u2014]/g,'-').replace(/½/g,'0.5');
  const m=s.match(/^([+-]?)\s*(\d+\s*\/\s*\d+|\d*\.?\d+)/);
  if(!m) return null;
  const num=m[2].replace(/\s/g,'');let v;
  if(num.includes('/')){const [a,b]=num.split('/');if(+b===0)return null;v=+a/+b;}else v=parseFloat(num);
  if(m[1]==='-')v=-v;
  return {v,unit:matchUnit(s.slice(m[0].length))};
}
const DIM={micrograms:['m',0.001],mg:['m',1],g:['m',1000],kg:['m',1e6],mL:['v',1],L:['v',1000],minutes:['t',1],hours:['t',60],cm:['d',1]};
function equiv(v,u,a,qu){const A=DIM[u],B=DIM[qu];if(!A||!B||A[0]!==B[0])return false;return Math.abs(v*A[1]-a*B[1])<=Math.abs(a*B[1])*0.005+1e-9;}
function numKind(q,v){
  const a=q.answer,tl=Math.max(q.tol,q.dp!=null?0.5*Math.pow(10,-q.dp):0.001);
  for(const [t,k] of q.traps) if(Math.abs(v-t)<=Math.max(tl,Math.abs(t)*0.01)) return k;
  if(q.signed&&a!==0&&Math.abs(v+a)<=tl) return 'sign';
  if(a!==0) for(const f of [1000,0.001,1e6,1e-6]) if(Math.abs(v-a*f)<=Math.abs(a*f)*0.01) return 'x1000';
  if(q.exact!=null&&Math.abs(v-q.exact)<0.5*Math.pow(10,-q.dp)+1e-9) return 'rounding';
  if(a!==0) for(const f of [10,0.1,100,0.01]) if(Math.abs(v-a*f)<=Math.abs(a*f)*0.01) return 'x10';
  return 'calc';
}
function grade(q,p,unitsOn){
  const kinds=[];const numOk=Math.abs(p.v-q.answer)<=q.tol;let unitOk=true;
  const u=p.unit;
  if(u.kind==='none'){if(unitsOn){unitOk=false;kinds.push('unitMissing');}}
  else if(u.kind==='banned'){unitOk=false;kinds.push(u.why);}
  else if(u.kind==='unknown'){unitOk=false;kinds.push('unitWrong');}
  else if(u.canon!==q.unit){
    unitOk=false;
    if(equiv(p.v,u.canon,q.answer,q.unit)) return {ok:false,kinds:['unitAsked'],numOk:false,unitOk:false};
    kinds.push('unitWrong');
  }
  if(!numOk) kinds.push(numKind(q,p.v));
  return {ok:numOk&&unitOk,kinds,numOk,unitOk};
}

export {makeQFor,grade,parseFull,TOPICS,LEVELS,FIELDS,fa,nf,rd,P};
