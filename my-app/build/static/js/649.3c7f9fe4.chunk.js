"use strict";(self.webpackChunktailadmin_react_free=self.webpackChunktailadmin_react_free||[]).push([[649],{649:(e,a,t)=>{t.r(a),t.d(a,{default:()=>n});var r=t(43),d=t(213),s=t(369),i=t(149),l=t(579);const n=()=>{const[e,a]=(0,r.useState)([]),[t,n]=(0,r.useState)([]),[o,k]=(0,r.useState)([]),[m,c]=(0,r.useState)((new Date).toISOString().split("T")[0]),[x,b]=(0,r.useState)(!1),[p,u]=(0,r.useState)(null),[h,v]=(0,r.useState)({appointmentID:null,firstName:"",lastName:"",phoneNumber:"",email:"",userID:"",serviceIDs:[],appointmentDate:"",status:"pa p\xebrfunduar",notes:""}),[N,f]=(0,r.useState)({appointmentID:null,firstName:"",lastName:"",phoneNumber:"",email:"",userID:"",serviceIDs:[],appointmentDate:"",status:"pa p\xebrfunduar",notes:""});(0,r.useEffect)((()=>{g(),j(),D()}),[]);const g=async()=>{try{const e=await d.A.get("https://api.studio-linda.com/api/Appointment");a(e.data)}catch(e){console.error("Error fetching appointments:",e)}},j=async()=>{try{const e=await d.A.get("https://api.studio-linda.com/api/Service"),a=Array.isArray(e.data)?e.data:[];n(a)}catch(e){console.error("Error fetching services:",e),n([])}},D=async()=>{try{const e=(await d.A.get("https://api.studio-linda.com/api/User")).data.filter((e=>2===e.roleID||3===e.roleID));k(e)}catch(e){console.error("Error fetching staff:",e),k([])}},w=e=>{const{name:a,value:t}=e.target;if("serviceIDs"===a){const t=e.target.selectedOptions,r=Array.from(t).map((e=>e.value));v({...h,[a]:r})}else v({...h,[a]:t})},y=e=>{const{name:a,value:t}=e.target;if("serviceIDs"===a){const t=e.target.selectedOptions,r=Array.from(t).map((e=>e.value));f({...N,[a]:r})}else f({...N,[a]:t})},I=async e=>{e.preventDefault();const t=N.serviceIDs.map((e=>Number(e))),r={client:{firstName:N.firstName,lastName:N.lastName,phoneNumber:N.phoneNumber,email:N.email},appointmentID:N.appointmentID||0,userID:Number(N.userID),serviceIDs:t,appointmentDate:N.appointmentDate,status:N.status,notes:N.notes};try{const e=await d.A.put(`https://api.studio-linda.com/api/Appointment/${N.appointmentID}`,r);g(),a((a=>a.map((a=>a.appointmentID===e.data.appointmentID?{...a,...e.data}:a)))),u(null),f({appointmentID:null,firstName:"",lastName:"",phoneNumber:"",email:"",userID:"",serviceIDs:[],appointmentDate:"",status:"pa p\xebrfunduar",notes:""})}catch(i){var s;console.error("Error while editing appointment:",(null===(s=i.response)||void 0===s?void 0:s.data)||i.message)}},S=e.filter((e=>!e.appointmentDate||isNaN(new Date(e.appointmentDate).getTime())?(console.warn(`Invalid appointment date for ID: ${e.appointmentID}`),!1):new Date(e.appointmentDate).toISOString().split("T")[0]===m));return(0,l.jsxs)("div",{className:"rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default sm:px-7.5 xl:pb-1 text-black dark:text-white dark:border-strokedark dark:bg-boxdark mb-20",children:[(0,l.jsxs)("div",{className:"flex justify-between items-center mb-6",children:[(0,l.jsx)("h1",{className:"text-xl font-semibold text-blue-900 dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Terminet"}),(0,l.jsxs)("div",{className:"flex items-center",children:[(0,l.jsx)("input",{type:"date",value:m,onChange:e=>c(e.target.value),className:"px-4 py-2 border rounded-md mr-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark"}),(0,l.jsx)("button",{onClick:()=>b(!x),className:"mt-4 px-4 py-2 bg-blue-600 text-white rounded-md",children:x?"X":"Shto Terminin"})]})]}),x&&(0,l.jsxs)("form",{onSubmit:async t=>{t.preventDefault();const r=h.serviceIDs.map((e=>Number(e))),s={client:{firstName:h.firstName,lastName:h.lastName,phoneNumber:h.phoneNumber,email:h.email},appointmentID:h.appointmentID||0,userID:Number(h.userID),serviceIDs:r,appointmentDate:h.appointmentDate,status:h.status,notes:h.notes};try{const t=await d.A.post("https://api.studio-linda.com/api/Appointment",s);g(),a([...e,t.data]),b(!1),v({appointmentID:null,firstName:"",lastName:"",phoneNumber:"",email:"",userID:"",serviceIDs:[],appointmentDate:"",status:"pa p\xebrfunduar",notes:""})}catch(l){var i;console.error("Error adding appointment:",(null===(i=l.response)||void 0===i?void 0:i.data)||l.message)}},className:"mt-4",children:[(0,l.jsxs)("div",{className:"grid grid-cols-2 gap-4 ",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Emri i Klientit"}),(0,l.jsx)("input",{type:"text",name:"firstName",value:h.firstName,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Mbiemri i Klientit"}),(0,l.jsx)("input",{type:"text",name:"lastName",value:h.lastName,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Numri i Klientit"}),(0,l.jsx)("input",{type:"text",name:"phoneNumber",value:h.phoneNumber,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Email i Klientit"}),(0,l.jsx)("input",{type:"email",name:"email",value:h.email,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Sh\xebrbimi"}),(0,l.jsxs)("select",{name:"serviceIDs",multiple:!0,value:h.serviceIDs,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0,children:[(0,l.jsx)("option",{value:"",children:"Zgjedh Sh\xebrbimet"}),t.map((e=>(0,l.jsx)("option",{value:e.serviceID,children:e.serviceName},e.serviceID)))]})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Stafi"}),(0,l.jsxs)("select",{name:"userID",value:h.userID,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0,children:[(0,l.jsx)("option",{value:"",children:"Zgjedh Stafin"}),o.map((e=>(0,l.jsxs)("option",{value:e.userID,children:[e.firstName," ",e.lastName]},e.userID)))]})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Data e Terminit"}),(0,l.jsx)("input",{type:"datetime-local",name:"appointmentDate",value:h.appointmentDate,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Statusi i Terminit"}),(0,l.jsxs)("select",{name:"status",value:h.status,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0,children:[(0,l.jsx)("option",{value:"pa p\xebrfunduar",children:"Pa P\xebrfunduar"}),(0,l.jsx)("option",{value:"p\xebrfunduar",children:"P\xebrfunduar"})]})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Sh\xebnime"}),(0,l.jsx)("textarea",{name:"notes",value:h.notes,onChange:w,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"})]})]}),(0,l.jsx)("button",{type:"submit",className:"mt-4 px-4 py-2 bg-blue-500 text-white rounded-md",children:"Shto Terminin"})]}),(0,l.jsx)("div",{className:"max-w-full overflow-x-auto mt-6 ",children:(0,l.jsxs)("table",{className:"w-full table-auto text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:[(0,l.jsx)("thead",{className:"bg-gray-200 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:(0,l.jsxs)("tr",{children:[(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Klienti"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Numri i Klientit"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Email i Klientit"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Sh\xebrbimi"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Stafi"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Data"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Statusi"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Sh\xebnimet"}),(0,l.jsx)("th",{className:"py-3 px-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Veptimet"})]})}),(0,l.jsx)("tbody",{children:S.map((e=>{var n,k,m,c;return(0,l.jsxs)(r.Fragment,{children:[(0,l.jsxs)("tr",{children:[(0,l.jsxs)("td",{className:"py-3 px-4 ",children:[null===(n=e.client)||void 0===n?void 0:n.firstName," ",null===(k=e.client)||void 0===k?void 0:k.lastName]}),(0,l.jsx)("td",{className:"py-3 px-4",children:null===(m=e.client)||void 0===m?void 0:m.phoneNumber}),(0,l.jsx)("td",{className:"py-3 px-4",children:null===(c=e.client)||void 0===c?void 0:c.email}),(0,l.jsxs)("td",{className:"py-3 px-4",children:[e.services&&e.services.length>0?e.services.map((e=>e.serviceName)).join(", "):"No services"," "]}),(0,l.jsx)("td",{className:"py-3 px-4",children:e.staffName||"No Staff"}),(0,l.jsx)("td",{className:"py-3 px-4",children:new Date(e.appointmentDate).toLocaleString()}),(0,l.jsx)("td",{className:"py-3 px-4",children:e.status}),(0,l.jsx)("td",{className:"py-3 px-4",children:e.notes}),(0,l.jsx)("td",{className:"py-4 px-4",children:(0,l.jsxs)("div",{className:"flex space-x-2 sm:justify-center",children:[(0,l.jsx)("button",{onClick:()=>(e=>{if(p===e.appointmentID){var a,r,d,s,i;u(null),f({appointmentID:e.appointmentID,firstName:(null===(a=e.client)||void 0===a?void 0:a.firstName)||"",lastName:(null===(r=e.client)||void 0===r?void 0:r.lastName)||"",phoneNumber:(null===(d=e.client)||void 0===d?void 0:d.phoneNumber)||"",email:(null===(s=e.client)||void 0===s?void 0:s.email)||"",userID:e.userID||"",serviceIDs:(null===(i=e.services)||void 0===i?void 0:i.map((e=>{var a;const r=t.find((a=>a.serviceName===e.serviceName));return(null===r||void 0===r||null===(a=r.serviceID)||void 0===a?void 0:a.toString())||""})))||[],appointmentDate:e.appointmentDate?new Date(e.appointmentDate).toISOString().slice(0,16):"",status:e.status||"pa p\xebrfunduar",notes:e.notes||""})}else{var l,n,k,m,c;const a=o.find((a=>`${a.firstName} ${a.lastName}`===e.staffName));u(e.appointmentID),f({appointmentID:e.appointmentID,firstName:(null===(l=e.client)||void 0===l?void 0:l.firstName)||"",lastName:(null===(n=e.client)||void 0===n?void 0:n.lastName)||"",phoneNumber:(null===(k=e.client)||void 0===k?void 0:k.phoneNumber)||"",email:(null===(m=e.client)||void 0===m?void 0:m.email)||"",serviceIDs:(null===(c=e.services)||void 0===c?void 0:c.map((e=>{var a;const r=t.find((a=>a.serviceName===e.serviceName));return(null===r||void 0===r||null===(a=r.serviceID)||void 0===a?void 0:a.toString())||""})))||[],userID:(null===a||void 0===a?void 0:a.userID)||"",appointmentDate:e.appointmentDate?new Date(e.appointmentDate).toISOString().slice(0,16):"",status:e.status||"pa p\xebrfunduar",notes:e.notes||""})}})(e),className:"bg-blue-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm",children:(0,l.jsx)(s.uO9,{})}),(0,l.jsx)("button",{onClick:()=>(async e=>{try{await d.A.delete(`https://api.studio-linda.com/api/Appointment/${e}`),a((a=>a.filter((a=>a.appointmentID!==e))))}catch(t){console.error("Error deleting appointment:",t)}})(e.appointmentID),className:"bg-red-500 text-white rounded-md px-4 py-2 text-base sm:px-4 sm:py-2 sm:text-sm",children:(0,l.jsx)(i.pS_,{})})]})})]}),p===e.appointmentID&&(0,l.jsx)("tr",{children:(0,l.jsx)("td",{colSpan:9,className:"py-4 px-4 bg-gray-100 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:(0,l.jsxs)("form",{onSubmit:I,children:[(0,l.jsxs)("div",{className:"grid grid-cols-2 gap-4 text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:[(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Emri i Klientit"}),(0,l.jsx)("input",{type:"text",name:"firstName",value:N.firstName,onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Mbiemri i Klientit"}),(0,l.jsx)("input",{type:"text",name:"lastName",value:N.lastName,onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Numri i Klientit"}),(0,l.jsx)("input",{type:"text",name:"phoneNumber",value:N.phoneNumber,onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Email i Klientit"}),(0,l.jsx)("input",{type:"email",name:"email",value:N.email,onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Sh\xebrbimet"}),(0,l.jsx)("select",{name:"serviceIDs",multiple:!0,value:N.serviceIDs,onChange:e=>{const a=Array.from(e.target.selectedOptions,(e=>e.value));f({...N,serviceIDs:a})},className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0,children:t.map((e=>(0,l.jsx)("option",{value:e.serviceID.toString(),children:e.serviceName},e.serviceID)))})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Stafi"}),(0,l.jsxs)("select",{name:"userID",value:N.userID||"",onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0,children:[(0,l.jsx)("option",{value:"",children:"Zgjedh Stafin"}),o.map((e=>(0,l.jsxs)("option",{value:e.userID,children:[e.firstName," ",e.lastName]},e.userID)))]})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Data e Terminit"}),(0,l.jsx)("input",{type:"datetime-local",name:"appointmentDate",value:N.appointmentDate,onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0})]}),(0,l.jsxs)("div",{children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Statusi"}),(0,l.jsxs)("select",{name:"status",value:N.status,onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark",required:!0,children:[(0,l.jsx)("option",{value:"pa p\xebrfunduar",children:"Pa P\xebrfunduar"}),(0,l.jsx)("option",{value:"p\xebrfunduar",children:"P\xebrfunduar"})]})]}),(0,l.jsxs)("div",{className:"col-span-2",children:[(0,l.jsx)("label",{className:"block font-medium text-black dark:text-white dark:border-strokedark dark:bg-boxdark",children:"Sh\xebnimet"}),(0,l.jsx)("textarea",{name:"notes",value:N.notes,onChange:y,className:"px-4 py-2 border rounded-md w-full text-black dark:text-white dark:border-strokedark dark:bg-boxdark"})]})]}),(0,l.jsx)("button",{type:"submit",className:"mt-4 px-4 py-2 bg-blue-500 text-white rounded-md",children:"Ruaj"})]})})})]},e.appointmentID)}))})]})})]})}}}]);
//# sourceMappingURL=649.3c7f9fe4.chunk.js.map