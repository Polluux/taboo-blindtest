import{d as v,u as f,r as s,c as u,i,v as d,b as n,t as b,f as g,h as x,k as p,l as y}from"./index-BsXQhAVk.js";const w=n("button",null,"Submit",-1),_={key:0,class:"relative rounded border border-red-400 bg-red-100 px-4 py-3 text-red-700",role:"alert"},k=v({__name:"login",setup(h){const c=f(),a=s(""),l=s(""),t=s("");async function m(){t.value="";const r=await c.login(a.value,l.value);r.data?y.replace({name:"home"}).catch(()=>{}):t.value=r.error}return(r,e)=>(p(),u("form",{onSubmit:e[2]||(e[2]=x(o=>m(),["prevent"])),class:"flex h-full flex-col items-center justify-center gap-2"},[i(n("input",{type:"mail",placeholder:"email","onUpdate:modelValue":e[0]||(e[0]=o=>a.value=o)},null,512),[[d,a.value]]),i(n("input",{type:"password",placeholder:"password","onUpdate:modelValue":e[1]||(e[1]=o=>l.value=o)},null,512),[[d,l.value]]),w,t.value?(p(),u("div",_,b(t.value),1)):g("",!0)],32))}});export{k as default};
