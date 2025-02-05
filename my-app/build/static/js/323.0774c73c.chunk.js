"use strict";(self.webpackChunktailadmin_react_free=self.webpackChunktailadmin_react_free||[]).push([[323],{323:(e,r,a)=>{a.r(r),a.d(r,{default:()=>l});var t=a(43),s=a(213),d=a(369),i=a(149),c=a(579);const l=e=>{let{searchQuery:r}=e;const[a,l]=(0,t.useState)([]),[n,o]=(0,t.useState)([]),[x,m]=(0,t.useState)(!1),[k,b]=(0,t.useState)({serviceID:null,serviceName:"",description:"",price:"",duration:"",staffEarningPercentage:""}),[p,h]=(0,t.useState)(null),[u,g]=(0,t.useState)({serviceID:null,serviceName:"",description:"",price:"",duration:"",staffEarningPercentage:""});(0,t.useEffect)((()=>{j(),f()}),[]);const j=async()=>{try{const e=await s.A.get("https://api.studio-linda.com/api/Service"),r=Array.isArray(e.data)?e.data:[];l(r)}catch(e){console.error("Error fetching services:",e),l([])}},f=async()=>{try{const e=await s.A.get("https://api.studio-linda.com/api/ServiceDiscount");o(e.data)}catch(e){console.error("Error fetching discounts:",e)}},v=e=>{const{name:r,value:a}=e.target;b({...k,[r]:a})},N=e=>{const{name:r,value:a}=e.target;g((e=>({...e,[r]:a})))},y=async e=>{e.preventDefault();const r={serviceID:u.serviceID,serviceName:u.serviceName,description:u.description,price:parseFloat(u.price),duration:parseInt(u.duration,10),staffEarningPercentage:parseFloat(u.staffEarningPercentage)};try{await s.A.put(`https://api.studio-linda.com/api/Service/${r.serviceID}`,r),l((e=>e.map((e=>e.serviceID===r.serviceID?{...e,...r}:e)))),h(null),window.dispatchEvent(new Event("dataUpdated"))}catch(a){console.error("Error updating service:",a)}},w=a.filter((e=>e.serviceName.toLowerCase().includes(r.toLowerCase())));return(0,c.jsxs)("div",{className:"rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1",children:[(0,c.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,c.jsx)("h1",{className:"text-xl font-semibold dark:text-white text-blue-900",children:"Sh\xebrbimet"}),(0,c.jsx)("button",{onClick:()=>{m(!x),b({serviceID:null,serviceName:"",description:"",price:"",duration:"",staffEarningPercentage:""})},className:"mt-4 px-4 py-2 bg-blue-600 text-white rounded-md",children:x?"Mbyll":"Shto Sh\xebrbim"})]}),x&&(0,c.jsxs)("form",{onSubmit:async e=>{e.preventDefault();const r={serviceID:0,serviceName:k.serviceName,description:k.description,price:parseFloat(k.price),duration:parseInt(k.duration,10),staffEarningPercentage:parseFloat(k.staffEarningPercentage)};try{const e=await s.A.post("https://api.studio-linda.com/api/Service",r);l([...a,e.data]),m(!1),b({serviceID:null,serviceName:"",description:"",price:"",duration:"",staffEarningPercentage:""})}catch(t){console.error("Error adding service:",t)}},className:"mt-4",children:[(0,c.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-white",children:"Emri i Sh\xebrbimit"}),(0,c.jsx)("input",{type:"text",name:"serviceName",placeholder:"Emri i Sh\xebrbimit",value:k.serviceName,onChange:v,required:!0,className:"px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"})]}),(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-white",children:"P\xebrshkrimi"}),(0,c.jsx)("textarea",{name:"description",placeholder:"P\xebrshkrimi",value:k.description,onChange:v,required:!0,className:"px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"})]}),(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-white",children:"\xc7mimi"}),(0,c.jsx)("input",{type:"number",name:"price",placeholder:"\xc7mimi",value:k.price,onChange:v,required:!0,className:"px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"})]}),(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-white",children:"Koh\xebzgjatja (min)"}),(0,c.jsx)("input",{type:"number",name:"duration",placeholder:"Koh\xebzgjatja",value:k.duration,onChange:v,required:!0,className:"px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"})]}),(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-white",children:"Paga e Stafit (%)"}),(0,c.jsx)("input",{type:"number",name:"staffEarningPercentage",placeholder:"Paga e Stafit",value:k.staffEarningPercentage,onChange:v,required:!0,className:"px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"})]})]}),(0,c.jsx)("button",{type:"submit",className:"px-4 py-2 bg-green-500 text-white rounded-md mt-4",children:"Shto"})]}),(0,c.jsx)("div",{className:"max-w-full overflow-x-auto mt-6",children:(0,c.jsxs)("table",{className:"w-full table-auto dark:border-strokedark dark:bg-boxdark",children:[(0,c.jsx)("thead",{children:(0,c.jsxs)("tr",{className:"bg-gray-200 text-left",children:[(0,c.jsx)("th",{className:"py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Emri i Sh\xebrbimit"}),(0,c.jsx)("th",{className:"py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark",children:"P\xebrshkrimi"}),(0,c.jsx)("th",{className:"py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark",children:"\xc7mimi (Aktual)"}),(0,c.jsx)("th",{className:"py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Koh\xebzgjatja"}),(0,c.jsx)("th",{className:"py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Paga e Stafit (%)"}),(0,c.jsx)("th",{className:"py-4 px-4 text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Veprime"})]})}),(0,c.jsx)("tbody",{children:w.map((e=>(0,c.jsxs)(t.Fragment,{children:[(0,c.jsxs)("tr",{children:[(0,c.jsx)("td",{className:"py-4 px-4 dark:text-white text-black",children:e.serviceName}),(0,c.jsx)("td",{className:"py-4 px-4 dark:text-white text-black",children:e.description}),(0,c.jsx)("td",{className:"py-4 px-4 dark:text-white text-black",children:e.discountPrice>0?`${e.discountPrice}\u20ac`:`${e.price}\u20ac`}),(0,c.jsxs)("td",{className:"py-4 px-4 dark:text-white text-black",children:[e.duration," min"]}),(0,c.jsxs)("td",{className:"py-4 px-4 dark:text-white text-black",children:[e.staffEarningPercentage,"%"]}),(0,c.jsx)("td",{className:"py-4 px-4",children:(0,c.jsxs)("div",{className:"flex space-x-2 sm:justify-center",children:[(0,c.jsx)("button",{onClick:()=>(e=>{p===e.serviceID?h(null):(h(e.serviceID),g(e))})(e),className:"bg-blue-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm",children:(0,c.jsx)(d.uO9,{})}),(0,c.jsx)("button",{onClick:()=>(async e=>{try{await s.A.delete(`https://api.studio-linda.com/api/Service/${e}`),l((r=>r.filter((r=>r.serviceID!==e))))}catch(r){console.error("Error deleting service:",r)}})(e.serviceID),className:"bg-red-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm",children:(0,c.jsx)(i.pS_,{})})]})})]}),p===e.serviceID&&(0,c.jsx)("tr",{children:(0,c.jsx)("td",{colSpan:6,className:"py-4 px-4 bg-gray-100 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:(0,c.jsxs)("form",{onSubmit:y,children:[(0,c.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Emri i Sh\xebrbimit"}),(0,c.jsx)("input",{type:"text",name:"serviceName",value:u.serviceName,onChange:N,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"P\xebrshkrimi"}),(0,c.jsx)("textarea",{name:"description",value:u.description,onChange:N,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"\xc7mimi"}),(0,c.jsx)("input",{type:"number",name:"price",value:u.price,onChange:N,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Koh\xebzgjatja (min)"}),(0,c.jsx)("input",{type:"number",name:"duration",value:u.duration,onChange:N,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]})]}),(0,c.jsxs)("div",{className:"grid grid-cols-2 gap-4",children:[" ",(0,c.jsxs)("div",{className:"mb-4",children:[(0,c.jsx)("label",{className:"block text-sm font-medium text-gray-700 dark:text-white",children:"Paga e Stafit (%)"}),(0,c.jsx)("input",{type:"number",name:"staffEarningPercentage",placeholder:"Paga e Stafit",value:u.staffEarningPercentage,onChange:v,required:!0,className:"px-4 py-2 border text-black border-gray-300 dark:text-white rounded-md w-full dark:border-strokedark dark:bg-boxdark"})]})]}),(0,c.jsx)("button",{type:"submit",className:"mt-4 px-4 py-2 bg-blue-900 text-white rounded-md",children:"Ruaj"})]})})})]},e.serviceID)))})]})})]})}}}]);
//# sourceMappingURL=323.0774c73c.chunk.js.map