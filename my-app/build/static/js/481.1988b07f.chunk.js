"use strict";(self.webpackChunktailadmin_react_free=self.webpackChunktailadmin_react_free||[]).push([[481],{481:(e,t,a)=>{a.r(t),a.d(t,{default:()=>g});var s=a(43),r=a(579);const l=e=>{let{title:t,total:a,rate:s,levelUp:l,levelDown:o,children:n,className:i}=e;return(0,r.jsxs)("div",{className:`rounded-sm border border-stroke bg-white py-6 px-7.5 shadow-default dark:border-strokedark dark:bg-boxdark ${i}`,children:[(0,r.jsx)("div",{className:"flex h-11.5 w-11.5 items-center justify-center rounded-full bg-meta-2 dark:bg-meta-4",children:n}),(0,r.jsxs)("div",{className:"mt-4 flex items-end justify-between",children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h4",{className:"text-title-md font-bold text-black dark:text-white",children:a}),(0,r.jsx)("span",{className:"text-sm font-medium",children:t})]}),(0,r.jsxs)("span",{className:`flex items-center gap-1 text-sm font-medium ${l&&"text-meta-3"} ${o&&"text-meta-5"}`,children:[s,l&&(0,r.jsx)("svg",{className:"fill-meta-3",width:"10",height:"11",viewBox:"0 0 10 11",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,r.jsx)("path",{d:"M4.35716 2.47737L0.908974 5.82987L5.0443e-07 4.94612L5 0.0848689L10 4.94612L9.09103 5.82987L5.64284 2.47737L5.64284 10.0849L4.35716 10.0849L4.35716 2.47737Z",fill:""})}),o&&(0,r.jsx)("svg",{className:"fill-meta-5",width:"10",height:"11",viewBox:"0 0 10 11",fill:"none",xmlns:"http://www.w3.org/2000/svg",children:(0,r.jsx)("path",{d:"M5.64284 7.69237L9.09102 4.33987L10 5.22362L5 10.0849L-8.98488e-07 5.22362L0.908973 4.33987L4.35716 7.69237L4.35716 0.0848701L5.64284 0.0848704L5.64284 7.69237Z",fill:""})})]})]})]})};var o=a(19),n=a(213);const i=()=>{const[e,t]=(0,s.useState)([{name:"Numri i Takimeve",data:[]}]),[a,l]=(0,s.useState)([]),[i,d]=(0,s.useState)(localStorage.getItem("colorMode")||"light");(0,s.useEffect)((()=>{const e=new MutationObserver((()=>{const e=document.body.classList.contains("dark");d(e?"dark":"light")}));return e.observe(document.body,{attributes:!0,attributeFilter:["class"]}),()=>e.disconnect()}),[]),(0,s.useEffect)((()=>{c()}),[]);const c=async()=>{try{const e=new Date((new Date).getFullYear(),(new Date).getMonth(),1),a=new Date((new Date).getFullYear(),(new Date).getMonth()+1,0),s=(await n.A.get("https://api.studio-linda.com/api/Appointment/appointment-count-weekly",{params:{startDate:e.toISOString(),endDate:a.toISOString()}})).data,r=s.map((e=>`Java ${e.week}`)),o=s.map((e=>e.appointmentCount));l(r),t([{name:"Numri i Takimeve",data:o}])}catch(e){console.error("Error fetching weekly appointment data:",e)}},h={chart:{type:"area",height:350,toolbar:{show:!1},background:"transparent"},colors:["#3C50E0"],stroke:{curve:"smooth",width:2},fill:{type:"gradient",gradient:{shadeIntensity:1,opacityFrom:.7,opacityTo:.3,stops:[0,90,100]}},grid:{borderColor:"dark"===i?"#2D3748":"#E5E7EB",xaxis:{lines:{show:!0}},yaxis:{lines:{show:!0}}},dataLabels:{enabled:!1},markers:{size:4,colors:"#fff",strokeColors:["#3056D3"],strokeWidth:2},xaxis:{type:"category",categories:a,labels:{style:{colors:"dark"===i?"#FFFFFF":"#374151"}}},yaxis:{title:{text:""},labels:{style:{colors:"dark"===i?"#FFFFFF":"#374151"}}},legend:{position:"top",horizontalAlign:"right",labels:{colors:"dark"===i?"#FFFFFF":"#374151"}}};return(0,r.jsxs)("div",{className:"p-6 rounded-lg max-w-lg mx-auto border border-gray-300 dark:border-gray-700",style:{backgroundColor:"dark"===i?"transparent":"#FFFFFF",maxWidth:"900px"},children:[(0,r.jsx)("h2",{className:"text-xl font-semibold text-center mb-4",style:{color:"dark"===i?"#FFFFFF":"#374151"},children:"Terminet Mujore"}),(0,r.jsx)(o.A,{options:h,series:e,type:"area",height:250})]})},d=()=>{const[e,t]=(0,s.useState)("monthly"),[a,l]=(0,s.useState)({labels:[],series:[]}),[i,d]=(0,s.useState)(!0),[c,h]=(0,s.useState)(null),m=async()=>{d(!0),h(null);const{startDate:t,endDate:a}=(()=>{const t=new Date;let a,s;return"daily"===e?(a=new Date(t.getFullYear(),t.getMonth(),t.getDate()),s=new Date(t.getFullYear(),t.getMonth(),t.getDate()+1)):"monthly"===e?(a=new Date(t.getFullYear(),t.getMonth(),1),s=new Date(t.getFullYear(),t.getMonth()+1,1)):(a=new Date(t.getFullYear(),0,1),s=new Date(t.getFullYear()+1,0,1)),{startDate:a.toISOString(),endDate:s.toISOString()}})();try{const e=await n.A.get("https://api.studio-linda.com/api/Appointment/services-completed",{params:{startDate:t,endDate:a}});if(console.log("Response Data:",e.data),null!==e&&void 0!==e&&e.data&&Array.isArray(e.data)){const t=e.data.map((e=>e.serviceName)),a=e.data.map((e=>e.count));l({labels:t,series:a})}else console.error("Unexpected API response format:",e),h("Unexpected API response format.")}catch(r){var s;if(console.error("Error fetching data:",r),n.A.isAxiosError(r))h(`Failed to fetch data: ${(null===(s=r.response)||void 0===s?void 0:s.data)||r.message}`);else h("Failed to load data.")}finally{d(!1)}};(0,s.useEffect)((()=>{m()}),[e]),(0,s.useEffect)((()=>{console.log("Chart Data:",a)}),[a]);const p={chart:{type:"donut"},colors:["#3C50E0","#6577F3","#8FD0EF","#0FADCF","#1A73E8","#5B73E8","#738AE0","#4A90E2","#002366","#6A5ACD","#9370DB","#8A2BE2","#9400D3","#7B68EE","#6A5ACD","#483D8B","#4169E1","#7C83FD","#6B8E23","#5F9EA0"].slice(0,a.labels.length),labels:a.labels,legend:{show:!0},plotOptions:{pie:{donut:{size:"65%"}}},dataLabels:{enabled:!1}},x=Array.isArray(a.series)&&a.series.length>0&&Array.isArray(a.labels)&&a.labels.length>0;return(0,r.jsxs)("div",{children:[(0,r.jsxs)("div",{children:[(0,r.jsx)("h5",{className:"text-blue-900 dark:text-white",children:"Sh\xebrbimet m\xeb t\xeb Shpesha"}),(0,r.jsxs)("select",{value:e,onChange:e=>t(e.target.value),children:[(0,r.jsx)("option",{value:"daily",children:"Ditore"}),(0,r.jsx)("option",{value:"monthly",children:"Mujore"}),(0,r.jsx)("option",{value:"yearly",children:"Vjetore"})]})]}),i&&(0,r.jsx)("p",{children:"Loading..."}),c&&(0,r.jsx)("p",{className:"text-red-500",children:c}),i||c||!x?(0,r.jsx)("p",{children:"No valid data available to display."}):(0,r.jsx)(o.A,{options:p,series:a.series,type:"donut"})]})};var c=a(238),h=a(555),m=a(252);const p=()=>{const[e,t]=(0,s.useState)([]),[a,l]=(0,s.useState)(localStorage.getItem("colorMode")||"light");(0,s.useEffect)((()=>{const e=new MutationObserver((()=>{const e=document.body.classList.contains("dark");l(e?"dark":"light")}));return e.observe(document.body,{attributes:!0,attributeFilter:["class"]}),()=>e.disconnect()}),[]);(0,s.useEffect)((()=>{(async()=>{try{const e=(0,c.A)(new Date,{weekStartsOn:1}),a=(0,h.A)(new Date,{weekStartsOn:1});console.log("Start of Current Week:",e),console.log("End of Current Week:",a);const s=(0,m.A)(e,"yyyy-MM-dd"),r=(0,m.A)(a,"yyyy-MM-dd"),l=await n.A.get("https://api.studio-linda.com/api/Appointment/appointments-completed-by-day",{params:{startDate:s,endDate:r}});console.log("API Response:",l.data);const o=l.data.map((e=>e.completedAppointments));console.log("Mapped Appointments:",o),t(o)}catch(e){console.error("Error fetching weekly data:",e),t([0,0,0,0,0,0,0])}})()}),[]);const i={chart:{type:"bar",height:250,toolbar:{show:!1},background:"transparent"},plotOptions:{bar:{columnWidth:"50%",borderRadius:4}},xaxis:{categories:["E H\xebn\xeb","E Mart\xeb","E M\xebrkur\xeb","E Enjte","E Premte","E Shtun\xeb","E Diel"],labels:{style:{colors:"dark"===a?"#FFFFFF":"#374151"}}},yaxis:{title:{text:"Terminet",style:{color:"dark"===a?"#FFFFFF":"#374151"}},labels:{style:{colors:"dark"===a?"#FFFFFF":"#374151"}}},grid:{borderColor:"dark"===a?"#2D3748":"#E5E7EB"},dataLabels:{enabled:!1},colors:["#2563EB"]},d=[{name:"Terminet",data:e}];return(0,r.jsxs)("div",{className:"p-6 rounded-lg max-w-lg mx-auto border border-gray-300 dark:border-gray-700",style:{backgroundColor:"dark"===a?"transparent":"#FFFFFF"},children:[(0,r.jsx)("h2",{className:"text-xl font-semibold text-center mb-4",style:{color:"dark"===a?"#FFFFFF":"#374151"},children:"Terminet Javore"}),(0,r.jsx)(o.A,{options:i,series:d,type:"bar",height:250})]})},x=()=>{const[e,t]=(0,s.useState)([]),[a,l]=(0,s.useState)(!0),[o,i]=(0,s.useState)(null),d=["#3C50E0","#6577F3","#8FD0EF","#0FADCF","#6A5ACD","#7B68EE","#8A2BE2","#9370DB","#483D8B","#4169E1"];return(0,s.useEffect)((()=>{(async()=>{l(!0),i(null);try{const e=await n.A.get("https://api.studio-linda.com/api/Appointment/top-customers");null!==e&&void 0!==e&&e.data&&Array.isArray(e.data)?t(e.data):i("Formati i p\xebrgjigjes API \xebsht\xeb i papritur.")}catch(e){i("D\xebshtoi ngarkimi i klient\xebve m\xeb t\xeb mir\xeb.")}finally{l(!1)}})()}),[]),a?(0,r.jsx)("p",{children:"Po ngarkohet..."}):o?(0,r.jsx)("p",{className:"text-red-500",children:o}):(0,r.jsxs)("div",{className:"col-span-12 rounded-sm border border-stroke m-7 p-5 bg-white py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4",children:[(0,r.jsx)("h4",{className:"mb-6 px-7.5 text-xl font-semibold text-black dark:text-white",children:"10 Klient\xebt m\xeb t\xeb rregullt"}),(0,r.jsx)("div",{children:e.map(((e,t)=>(0,r.jsxs)("div",{className:"flex items-center gap-5 py-3 px-7.5 hover:bg-gray-3 dark:hover:bg-meta-4",children:[(0,r.jsx)("div",{className:"relative h-14 w-14 flex items-center justify-center font-bold text-white",style:{backgroundColor:d[t%d.length],borderRadius:"5px"},children:e.name.charAt(0).toUpperCase()}),(0,r.jsx)("div",{className:"flex flex-1 items-center justify-between",children:(0,r.jsxs)("div",{children:[(0,r.jsx)("h5",{className:"font-medium text-black dark:text-white",children:e.name}),(0,r.jsxs)("p",{className:"text-sm text-black dark:text-white",children:[e.completedAppointments," Takime t\xeb P\xebrfunduara"]})]})})]},t)))})]})},g=()=>{const[e,t]=(0,s.useState)(0),[a,o]=(0,s.useState)(0),[c,h]=(0,s.useState)(0),[m,g]=(0,s.useState)(0);return(0,s.useEffect)((()=>{(async()=>{try{const e=await n.A.get("https://api.studio-linda.com/api/Appointment/total-completed-appointments");g(e.data.completedAppointmentsCount)}catch(e){console.error("Error fetching completed appointments:",e)}})(),(async()=>{try{const e=await n.A.get("https://api.studio-linda.com/api/Service/total-services");h(e.data.totalServices)}catch(e){console.error("Error fetching total services:",e)}})(),(async()=>{try{const e=await n.A.get("https://api.studio-linda.com/api/User/total-staff");t(e.data.totalStaff)}catch(e){console.error("Error fetching total staff:",e)}})(),(async()=>{try{const e=await n.A.get("https://api.studio-linda.com/api/Appointment/total-price");o(e.data)}catch(e){console.error("Error fetching total price:",e)}})()}),[]),(0,r.jsxs)(r.Fragment,{children:[(0,r.jsxs)("div",{className:"grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 dark:text-white text-black",children:[(0,r.jsx)(l,{title:"Numri i Stafit",total:`${e}`,rate:"0.43%",levelUp:!0,className:"p-4",children:(0,r.jsx)("svg",{className:"w-10 h-10 text-gray-800 dark:text-white","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",width:"80",height:"80",fill:"currentColor",viewBox:"0 0 24 24",children:(0,r.jsx)("path",{"fill-rule":"evenodd",d:"M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4h-4Z","clip-rule":"evenodd"})})}),(0,r.jsx)(l,{title:"Fitimi total",total:`${a.toFixed(2)}\u20ac`,rate:"4.35%",levelUp:!0,className:"p-4",children:(0,r.jsx)("svg",{className:"w-10 h-10 text-gray-800 dark:text-white","aria-hidden":"true",xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",fill:"none",viewBox:"0 0 24 24",children:(0,r.jsx)("path",{stroke:"currentColor","stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M6 10h9.231M6 14h9.231M18 5.086A5.95 5.95 0 0 0 14.615 4c-3.738 0-6.769 3.582-6.769 8s3.031 8 6.769 8A5.94 5.94 0 0 0 18 18.916"})})}),(0,r.jsx)(l,{title:"Numri i Sh\xebrbimeve",total:`${c}`,rate:"0.43%",levelUp:!0,className:"p-4",children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",className:"w-10 h-10 text-gray-800 dark:text-white",children:(0,r.jsx)("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"m7.848 8.25 1.536.887M7.848 8.25a3 3 0 1 1-5.196-3 3 3 0 0 1 5.196 3Zm1.536.887a2.165 2.165 0 0 1 1.083 1.839c.005.351.054.695.14 1.024M9.384 9.137l2.077 1.199M7.848 15.75l1.536-.887m-1.536.887a3 3 0 1 1-5.196 3 3 3 0 0 1 5.196-3Zm1.536-.887a2.165 2.165 0 0 0 1.083-1.838c.005-.352.054-.695.14-1.025m-1.223 2.863 2.077-1.199m0-3.328a4.323 4.323 0 0 1 2.068-1.379l5.325-1.628a4.5 4.5 0 0 1 2.48-.044l.803.215-7.794 4.5m-2.882-1.664A4.33 4.33 0 0 0 10.607 12m3.736 0 7.794 4.5-.802.215a4.5 4.5 0 0 1-2.48-.043l-5.326-1.629a4.324 4.324 0 0 1-2.068-1.379M14.343 12l-2.882 1.664"})})}),(0,r.jsx)(l,{title:"Terminet e P\xebrfunduara",total:`${m}`,rate:"0.95%",levelDown:!0,className:"p-4",children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24","stroke-width":"1.5",stroke:"currentColor",className:"w-10 h-10 text-gray-800 dark:text-white",children:(0,r.jsx)("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"})})})]}),(0,r.jsxs)("div",{className:"mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5",children:[(0,r.jsx)("div",{className:"col-span-1",children:(0,r.jsx)(i,{})}),(0,r.jsx)("div",{className:"col-span-1",children:(0,r.jsx)(p,{})}),(0,r.jsx)("div",{className:"col-span-1",children:(0,r.jsx)(d,{})}),(0,r.jsx)("div",{className:"col-span-1",children:(0,r.jsx)(x,{})})]})]})}}}]);
//# sourceMappingURL=481.1988b07f.chunk.js.map