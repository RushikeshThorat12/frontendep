// src/App.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaAddressCard, FaBook, FaMale, FaFemale, FaBirthdayCake, FaTachometerAlt, FaFileAlt, FaSignInAlt, FaChair, FaCalendarAlt, FaIdBadge, FaClipboardList, FaEnvelopeOpenText, FaBell, FaPlus, FaTrash } from "react-icons/fa";

/**
 Single-file App with two in-file Extract modals:
  - Extract Aadhaar (opens when clicking "Extract Aadhaar Text")
  - Extract PAN (opens when clicking "Extract PAN Details")
 Both modals are written compactly (horizontal-style) to save lines.
*/

export default function App(){ 
  const navigate = useNavigate(); const subjectInputRef = useRef(null);
  const [activePage,setActivePage]=useState("main"); // 'main' | 'extractAadhaar' | 'extractPan'
  const [formData,setFormData]=useState({name:"",aadhaarNumber:"",panNumber:"",fatherName:"",motherName:"",dob:"",caste:"",subjects:[],percentage:"",email:"",gender:""});
  const [errors,setErrors]=useState({});
  useEffect(()=>{ const lc=sessionStorage.getItem("lc_result"); if(lc){ try{ const { caste } = JSON.parse(lc); setFormData(p=>({...p,caste:caste||""})); }catch(e){} sessionStorage.removeItem("lc_result"); } },[]);

  const styles={page:{fontFamily:"Arial, sans-serif",background:"#eef2f3",minHeight:"100vh"},topBar:{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#fff",borderBottom:"1px solid #ddd",padding:"1rem 1.5rem",height:"80px",boxSizing:"border-box"},govLabel:{fontWeight:"bold",color:"#0b3d91",fontSize:"1.2rem"},topButtons:{display:"flex",gap:"1rem"},navBar:{background:"#0b3d91",color:"#fff",display:"flex",alignItems:"center",padding:"0.5rem 2rem",gap:"1rem",flexWrap:"wrap"},navItem:{cursor:"pointer"},bannerContainer:{position:"relative",overflow:"hidden",background:"#d9534f",padding:"0.72rem 0",width:"100%",boxSizing:"border-box"},bannerText:{position:"absolute",top:0,left:"100%",whiteSpace:"nowrap",color:"#fff",fontWeight:"bold",fontSize:"1.08rem",animation:"slide 16s linear infinite"},main:{display:"flex",padding:"1.5rem 2rem",gap:"1rem",boxSizing:"border-box"},sidebar:{width:"220px",background:"#fff",border:"1px solid #ccc",borderRadius:"4px",padding:"1rem",boxSizing:"border-box",height:"fit-content"},sidebarItem:{display:"flex",alignItems:"center",marginBottom:"1rem",cursor:"pointer",color:"#0b3d91"},sidebarIcon:{marginRight:"0.5rem"},formWrapper:{flex:1,background:"#fff",padding:"1.5rem",borderRadius:"4px",boxShadow:"0 2px 6px rgba(0,0,0,0.1)",marginTop:"1rem",boxSizing:"border-box"},noticePanel:{width:"270px",background:"#fff",border:"1px solid #ccc",borderRadius:"4px",padding:"1rem",boxSizing:"border-box",height:"fit-content"},noticeHeader:{display:"flex",alignItems:"center",marginBottom:"0.75rem"},noticeIcon:{marginRight:"0.5rem",color:"#dc3545"},section:{marginBottom:"1.5rem",borderBottom:"1px solid #ddd",paddingBottom:"1.5rem"},inputGroup:{display:"flex",alignItems:"center",border:"1px solid #aaa",borderRadius:"4px",marginBottom:"1rem",padding:"0.5rem",background:"#fafafa",gap:"0.5rem"},icon:{color:"#0b3d91",marginRight:"0.5rem",minWidth:"22px"},input:{flex:1,border:"none",outline:"none",fontSize:"0.95rem",padding:"0.25rem 0"},textarea:{width:"100%",border:"1px solid #aaa",borderRadius:"4px",padding:"0.5rem",fontSize:"0.95rem",resize:"none"},buttonGroup:{display:"flex",flexWrap:"wrap",gap:"0.75rem",justifyContent:"flex-start",marginTop:"1rem"},button:{background:"#0b3d91",color:"#fff",border:"none",borderRadius:"4px",padding:"0.75rem 1.5rem",cursor:"pointer",transition:"background 0.2s"},labelSmall:{display:"block",marginBottom:"0.25rem",fontSize:"0.9rem",color:"#333"},submitButton:{background:"#0b3d91",color:"#fff",border:"none",padding:"0.75rem 1.5rem",borderRadius:"4px",cursor:"pointer"},tag:{display:"inline-flex",alignItems:"center",gap:"0.5rem",padding:"0.25rem 0.5rem",borderRadius:"14px",background:"#eef3ff",marginRight:"0.5rem",marginBottom:"0.5rem",fontSize:"0.9rem"},tagList:{display:"flex",flexWrap:"wrap",marginTop:"0.5rem"},smallError:{color:"#d9534f",fontSize:"0.85rem",marginTop:"0.25rem"} };

  const validate = d => { const err={}; if(!d.name||d.name.trim().length<3) err.name="Enter full name (min 3 characters)."; if(!/^\d{12}$/.test(d.aadhaarNumber)) err.aadhaarNumber="Aadhaar must be 12 digits."; if(d.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(d.panNumber.toUpperCase())) err.panNumber="PAN should be in format AAAAA0000A."; if(d.email && !/^\S+@\S+\.\S+$/.test(d.email)) err.email="Enter a valid email."; return err; };

  const handleChange = e => { const { name, value } = e.target; setFormData(p => ({ ...p, [name]: value })); };
  const addSubject = val => { const s = (val || subjectInputRef.current?.value || "").trim(); if(!s) return; setFormData(p => ({ ...p, subjects: Array.from(new Set([...p.subjects, s])) })); if(subjectInputRef.current) subjectInputRef.current.value = ""; subjectInputRef.current?.focus(); };
  const removeSubject = s => setFormData(p => ({ ...p, subjects: p.subjects.filter(x => x !== s) }));
  const handleKeyDownSubject = e => { if(e.key === "Enter"){ e.preventDefault(); addSubject(); } };
  const handleSubmit = e => { e.preventDefault(); const newErrors = validate(formData); setErrors(newErrors); if(Object.keys(newErrors).length){ const firstErr = Object.keys(newErrors)[0]; const el = document.querySelector(`[name="${firstErr}"]`); if(el) el.focus(); return; } const payload = {...formData, panNumber: formData.panNumber ? formData.panNumber.toUpperCase() : ""}; console.log("Form submitted:",payload); alert("Form submitted successfully — check console for payload."); };

  /** Compact in-file Extract Aadhaar modal (adapted from your ExtractPage.js) */
  const ExtractAadhaarInner = ({ onClose }) => {
    const nav = useNavigate(); const [file,setFile]=useState(null); const [preview,setPreview]=useState(null); const [loading,setLoading]=useState(false); const [error,setError]=useState(''); const [extractedName,setExtractedName]=useState(''); const [extractedAadhaar,setExtractedAadhaar]=useState(''); const [responseText,setResponseText]=useState(''); const canFill = (extractedName || extractedAadhaar) && responseText === 'Y';
    const onFileChange = e => { const f = e.target.files[0]; setFile(f); setPreview(f?URL.createObjectURL(f):null); setError(''); setExtractedName(''); setExtractedAadhaar(''); setResponseText(''); };
    const onExtract = async ev => { ev.preventDefault(); if(!file){ setError('Please select an image first'); return; } setLoading(true); setError(''); setExtractedName(''); setExtractedAadhaar(''); setResponseText(''); try{ const fd=new FormData(); fd.append('image',file); const extractRes = await fetch('http://localhost:5000/api/extract',{method:'POST',body:fd}); const body = await extractRes.json(); if(!extractRes.ok) throw new Error(body.error||'OCR failed'); const name = body.name?.trim(); const aadhaar = body.aadhaar_number?.trim(); if(!name && !aadhaar){ setError('No name or Aadhaar number found in OCR output'); return; } if(name) setExtractedName(name); if(aadhaar) setExtractedAadhaar(aadhaar); const classRes = await fetch('http://localhost:5000/api/classify-name',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})}); const classBody = await classRes.json(); if(!classRes.ok) throw new Error(classBody.error||'Model call failed'); setResponseText(classBody.response); }catch(err){ console.error('Error in extract/classify flow:',err); setError(err.message||String(err)); } finally{ setLoading(false); } };
    const onFill = () => { setFormData(prev=>({...prev,name:extractedName,aadhaarNumber:extractedAadhaar})); nav('/form'); onClose(); };
    return (<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1200}}><div style={{width:920,maxWidth:"96%",background:"#fff",borderRadius:8,padding:16,boxSizing:"border-box",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><strong>Extract Aadhaar Text</strong><div><button onClick={onClose} style={{marginRight:8,padding:"6px 10px"}}>Back</button></div></div><div style={{display:"flex",gap:16}}><div style={{flex:"0 0 40%",backgroundColor:"#e8f4fd",padding:12,borderRadius:6}}><h5 style={{marginTop:0}}>सामान्य प्रश्न / General Queries</h5><ul style={{fontSize:"0.95rem",paddingLeft:18}}><li>Make sure the Aadhaar image is clear and uncropped.</li><li>File types supported: .jpg, .jpeg, .png</li><li>Only front side of Aadhaar should be uploaded.</li><li>Ensure name is legible in the photo.</li></ul><button style={{marginTop:12,padding:"8px 12px"}} onClick={()=>nav('/chat')}>Chat with RAG Bot</button></div><div style={{flex:"0 0 60%",backgroundColor:"#e8f4fd",padding:12,borderRadius:6}}><h4 style={{marginTop:0}}>Extract & Verify Aadhaar</h4><div style={{background:"#fff",padding:12,borderRadius:6,marginBottom:12}}><strong>कैसे काम करता है / How it works:</strong><ol style={{marginTop:8,marginBottom:0,paddingLeft:18}}><li>Upload Aadhaar card image.</li><li>System will extract name & Aadhaar number.</li><li>Name will be verified by AI model.</li><li>If verified, the Fill button will be enabled.</li></ol></div><form onSubmit={onExtract}><div style={{marginBottom:12}}><input type="file" accept="image/png,image/jpeg" onChange={onFileChange} /></div>{preview && <div style={{textAlign:"center",marginBottom:12}}><img src={preview} alt="preview" style={{maxWidth:"100%",maxHeight:250,borderRadius:6}}/></div>}<button type="submit" disabled={loading} style={{width:"100%",padding:"10px"}}>{loading ? 'Processing…' : 'Extract & Query Model'}</button></form>{error && <div style={{color:"#d9534f",marginTop:12}}>⚠️ {error}</div>}{(extractedName||extractedAadhaar) && (<div style={{marginTop:12}}>{extractedName && <p><strong>Extracted Name:</strong> {extractedName}</p>}{extractedAadhaar && <p><strong>Extracted Aadhaar Number:</strong> {extractedAadhaar}</p>}<div style={{marginTop:8}}><p style={{marginBottom:4}}><strong>Model Response:</strong></p><pre style={{background:"#fff",padding:8,borderRadius:6}}>{responseText}</pre></div><button onClick={onFill} disabled={!canFill} style={{width:"100%",marginTop:12,padding:10,background: canFill ? "#0b3d91" : "#6c757d", color:"#fff", border:"none", borderRadius:4}}>{canFill ? 'Fill into Form' : 'Fill disabled — verification required'}</button></div>)}</div></div></div></div>);
  };

  /** Compact in-file Extract PAN modal (adapted from your ExtractPanCard.js) */
  const ExtractPanInner = ({ onClose }) => {
    const nav = useNavigate(); const [file,setFile]=useState(null); const [preview,setPreview]=useState(null); const [data,setData]=useState(null); const [loading,setLoading]=useState(false);
    const [verifyingName,setVerifyingName]=useState(false); const [nameVerified,setNameVerified]=useState(false); const [nameInvalid,setNameInvalid]=useState(false);
    const [verifyingPan,setVerifyingPan]=useState(false); const [panVerified,setPanVerified]=useState(false); const [panInvalid,setPanInvalid]=useState(false);
    const [error,setError]=useState('');
    const handleFileChange = e => { const f=e.target.files[0]; setFile(f); setPreview(f?URL.createObjectURL(f):null); setData(null); setNameVerified(false); setNameInvalid(false); setPanVerified(false); setPanInvalid(false); setError(''); };
    const handleExtract = async ev => { ev.preventDefault(); if(!file){ setError('Please select a file first.'); return; } setLoading(true); setError(''); setData(null); setNameVerified(false); setNameInvalid(false); setPanVerified(false); setPanInvalid(false); try{ const form = new FormData(); form.append('image',file); const res = await fetch('/api/vision-extract',{method:'POST',body:form}); const json = await res.json(); if(!res.ok) throw new Error(json.error||'Extraction failed'); setData(json); }catch(err){ setError(err.message||String(err)); } finally{ setLoading(false); } };
    const handleVerifyName = async () => { if(!data?.name) return; setVerifyingName(true); setError(''); setNameVerified(false); setNameInvalid(false); try{ const res = await fetch('/api/classify-name',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name})}); const { response } = await res.json(); if(!res.ok) throw new Error(response||'Name verification failed'); response.trim().toUpperCase()==='Y' ? setNameVerified(true) : setNameInvalid(true); }catch(err){ setError(err.message||String(err)); } finally{ setVerifyingName(false); } };
    const handleVerifyPan = async () => { if(!data?.pan_number) return; setVerifyingPan(true); setError(''); setPanVerified(false); setPanInvalid(false); try{ const res = await fetch('/api/classify-pan',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({pan_number:data.pan_number})}); const { response } = await res.json(); if(!res.ok) throw new Error(response||'PAN verification failed'); response.trim().toUpperCase()==='Y' ? setPanVerified(true) : setPanInvalid(true); }catch(err){ setError(err.message||String(err)); } finally{ setVerifyingPan(false); } };
    const handleFillForm = () => { const aadhaarName = (formData.name||'').trim(); const panName = (data?.name||'').trim(); if(!aadhaarName || !panName){ setError('Both Aadhaar name and PAN name must be present to compare.'); return; } const [a0,...aRest]=aadhaarName.split(/\s+/); const [p0,...pRest]=panName.split(/\s+/); const aL = aRest.length ? aRest[aRest.length-1] : a0; const pL = pRest.length ? pRest[pRest.length-1] : p0; if(a0.toLowerCase()!==p0.toLowerCase() || aL.toLowerCase()!==pL.toLowerCase()){ setError(`Name mismatch!\\nAadhaar: \"${aadhaarName}\"\\nPAN:     \"${panName}\".`); setFormData(prev=>({...prev,panNumber:'',fatherName:'',dob:''})); return; } setFormData(prev=>({...prev,panNumber:data.pan_number,fatherName:data.father_name,dob:data.dob})); nav('/form'); onClose(); };
    return (<div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.35)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1200}}><div style={{width:920,maxWidth:"96%",background:"#fff",borderRadius:8,padding:16,boxSizing:"border-box",boxShadow:"0 8px 24px rgba(0,0,0,0.2)"}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><strong>PAN Card Extraction & Verification</strong><div><button onClick={onClose} style={{marginRight:8,padding:"6px 10px"}}>Back</button></div></div><div style={{display:"flex",gap:16}}><div style={{flex:"0 0 40%",backgroundColor:"#e8f4fd",padding:12,borderRadius:6}}><h5 style={{marginTop:0}}>सामान्य प्रश्न / General Queries</h5><ul style={{fontSize:"1rem",paddingLeft:18,marginTop:8}}><li>Ensure the uploaded image text is clearly visible.</li><li>Supported formats: .jpg, .jpeg, .png</li><li>Upload front side of PAN only.</li><li>Image should not be cropped or blurred.</li></ul><button style={{marginTop:12,padding:"8px 12px"}} onClick={()=>nav('/chat')}>Chat with RAG Bot</button></div><div style={{flex:"0 0 60%",backgroundColor:"#e8f4fd",padding:12,borderRadius:6}}><h4 style={{marginTop:0}}>PAN Card Extraction & Verification</h4><div style={{background:"#fff",padding:12,borderRadius:6,marginBottom:12}}><strong>कैसे काम करता है / How it works:</strong><ol style={{marginTop:8,marginBottom:0,paddingLeft:18}}><li>Upload PAN card image.</li><li>System extracts PAN & name details.</li><li>Name is verified by AI model.</li><li>If both pass, you can fill the form.</li></ol></div><form onSubmit={handleExtract}><div style={{marginBottom:12}}><input type="file" accept="image/*" onChange={handleFileChange} /></div>{preview && <div style={{textAlign:"center",marginBottom:12}}><img src={preview} alt="preview" style={{maxWidth:"100%",maxHeight:250,borderRadius:6}}/></div>}<button type="submit" disabled={loading} style={{width:"100%",padding:10}}>{loading ? 'Processing…' : 'Extract & Parse'}</button></form>{error && <div style={{color:"#d9534f",marginTop:12}}>⚠️ {error}</div>}{data && (<div style={{marginTop:12}}><h5 style={{marginBottom:8}}>Extracted Details:</h5><ul style={{marginTop:0}}><li><strong>PAN Number:</strong> {data.pan_number}</li><li><strong>Name:</strong> {data.name}</li><li><strong>Father's Name:</strong> {data.father_name}</li><li><strong>Date of Birth:</strong> {data.dob}</li></ul><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginTop:12}}><button onClick={handleVerifyName} disabled={verifyingName||nameVerified} style={{padding:10,background: nameVerified? "#28a745":"transparent",border:nameVerified? "none":"1px solid #28a745",color: nameVerified? "#fff":"#28a745",borderRadius:4}}>{verifyingName? 'Verifying Name…' : nameVerified? 'Name Verified ✅' : nameInvalid? 'Invalid Name ❌' : 'Verify Name'}</button><button onClick={handleVerifyPan} disabled={!nameVerified||verifyingPan||panVerified} style={{padding:10,background: panVerified? "#28a745":"transparent",border:panVerified? "none":"1px solid #28a745",color: panVerified? "#fff":"#28a745",borderRadius:4}}>{verifyingPan? 'Verifying PAN…' : panVerified? 'PAN Verified ✅' : panInvalid? 'Invalid PAN ❌' : 'Verify PAN'}</button></div>{nameVerified && panVerified && (<button onClick={handleFillForm} style={{width:"100%",marginTop:12,padding:10,background:"#0b3d91",color:"#fff",border:"none",borderRadius:4}}>Fill Form</button>)}</div>)}</div></div></div></div>);
  };

  // Render main or modal
  if(activePage==="extractAadhaar") return <ExtractAadhaarInner onClose={()=>setActivePage("main")}/>;
  if(activePage==="extractPan") return <ExtractPanInner onClose={()=>setActivePage("main")}/>; // note ExtractPanInner reference

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.govLabel}>🇮🇳 भारत सरकार / Government of India</div>
        <div style={{textAlign:"center",flex:1}} />
        <div style={styles.topButtons}>
          <button onClick={()=>navigate("/")} style={{background:"transparent",border:"none",cursor:"pointer"}}>Home</button>
          <button onClick={()=>navigate("/marathi")} style={{background:"transparent",border:"none",cursor:"pointer"}}>मराठी</button>
          <button onClick={()=>navigate("/accessibility")} style={{background:"transparent",border:"none",cursor:"pointer"}}>A+</button>
          <button onClick={()=>navigate("/accessibility-minus")} style={{background:"transparent",border:"none",cursor:"pointer"}}>A-</button>
        </div>
      </div>

      <nav style={styles.navBar} aria-label="Primary navigation">{["How to Apply Online?","Benefit Schemes","Post Matric Scholarship","Pre Matric Scholarship","Pension Schemes","Farmer Schemes","Labour Schemes","Special Assistance Schemes"].map(i=>(<div key={i} style={styles.navItem}>{i}</div>))}</nav>

      <div style={styles.bannerContainer} role="region" aria-label="Important dates"><div style={styles.bannerText}>आवेदन की अंतिम तिथि: 31 जुलाई, 2025 | Apply by: 31 July, 2025</div></div>

      <div style={styles.main}>
        <aside style={styles.sidebar} aria-label="Sidebar menu">
          <div style={{marginBottom:"1rem",fontWeight:"bold",color:"#0b3d91"}}>Menu / मेन्यू</div>
          {[{to:'/dashboard',icon:<FaTachometerAlt style={styles.sidebarIcon}/>,label:'Dashboard'},{to:'/submissions',icon:<FaFileAlt style={styles.sidebarIcon}/>,label:'My Submissions'},{to:'/login',icon:<FaSignInAlt style={styles.sidebarIcon}/>,label:'Applicant Login'},{to:'/seats',icon:<FaChair style={styles.sidebarIcon}/>,label:'Seat Availability'},{to:'/schedule',icon:<FaCalendarAlt style={styles.sidebarIcon}/>,label:'Exam Schedule'},{to:'/admit-card',icon:<FaIdBadge style={styles.sidebarIcon}/>,label:'Admit Card Download'},{to:'/instructions',icon:<FaClipboardList style={styles.sidebarIcon}/>,label:'Exam Instructions'},{to:'/support',icon:<FaEnvelopeOpenText style={styles.sidebarIcon}/>,label:'Contact Support'}].map(({to,icon,label})=> (<div key={to} style={styles.sidebarItem} onClick={()=>navigate(to)} role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key==='Enter') navigate(to); }}>{icon}{label}</div>))}
          <div style={{marginTop:"1rem",textAlign:"center",color:"#666",fontSize:"0.9rem"}}>[logos omitted]</div>
        </aside>

        <div style={styles.formWrapper}>
          <h2>सहायक लिपिक आवेदन / Assistant Clerk Application Form</h2>
          <form onSubmit={handleSubmit} noValidate>
            <section style={styles.section} aria-labelledby="personal-details"><div id="personal-details" style={{position:'absolute',left:-9999,top:'auto',width:1,height:1,overflow:'hidden'}}>Personal details</div>
              {[
                {name:'name',type:'text',placeholder:'Full Name',required:true,icon:<FaUser style={styles.icon}/>},
                {name:'aadhaarNumber',type:'text',placeholder:'Aadhaar Number',required:true,icon:<FaAddressCard style={styles.icon}/>},
                {name:'panNumber',type:'text',placeholder:'PAN Number',required:false,icon:<FaIdBadge style={styles.icon}/>},
                {name:'fatherName',type:'text',placeholder:"Father's Name",required:false,icon:<FaMale style={styles.icon}/>},
                {name:'dob',type:'date',placeholder:null,required:false,icon:<FaBirthdayCake style={styles.icon}/>},
                {name:'motherName',type:'text',placeholder:"Mother's Name",required:false,icon:<FaFemale style={styles.icon}/>},
                {name:'caste',type:'text',placeholder:'Caste',required:false,icon:null}
              ].map(({name,type,placeholder,required,icon})=> (<div key={name} style={styles.inputGroup}>{icon}<input aria-label={placeholder||name} name={name} type={type} placeholder={placeholder||undefined} style={styles.input} value={formData[name]||''} onChange={handleChange} required={required} /></div>))}
              <div style={styles.inputGroup}><FaEnvelopeOpenText style={styles.icon}/><input name="email" type="email" placeholder="Email (optional)" aria-label="Email" style={styles.input} value={formData.email} onChange={handleChange} /></div>
              <div style={{marginBottom:'1rem'}}><div style={styles.labelSmall}>Gender</div><label style={{marginRight:'1rem'}}><input type="radio" name="gender" value="male" checked={formData.gender==='male'} onChange={handleChange}/> Male</label><label style={{marginRight:'1rem'}}><input type="radio" name="gender" value="female" checked={formData.gender==='female'} onChange={handleChange}/> Female</label><label><input type="radio" name="gender" value="other" checked={formData.gender==='other'} onChange={handleChange}/> Other</label></div>
              {errors.name && <div style={styles.smallError}>{errors.name}</div>}
              {errors.aadhaarNumber && <div style={styles.smallError}>{errors.aadhaarNumber}</div>}
              {errors.panNumber && <div style={styles.smallError}>{errors.panNumber}</div>}
              {errors.email && <div style={styles.smallError}>{errors.email}</div>}
            </section>

            <section style={styles.section} aria-labelledby="education"><div id="education" style={{position:'absolute',left:-9999,top:'auto',width:1,height:1,overflow:'hidden'}}>Education & marks</div>
              <div style={{marginBottom:'0.5rem'}}><div style={styles.labelSmall}>Subjects</div><div style={{display:'flex',gap:'0.5rem'}}><div style={{flex:1}}><div style={styles.inputGroup}><FaBook style={styles.icon}/><input name="subjectInput" ref={subjectInputRef} type="text" placeholder="Type subject and press Enter / Add" aria-label="Add subject" style={styles.input} onKeyDown={handleKeyDownSubject} /><button type="button" onClick={()=>addSubject()} aria-label="Add subject" style={{...styles.button,padding:'0.5rem 0.75rem'}}><FaPlus/></button></div><div style={styles.tagList} aria-live="polite">{formData.subjects.map(s=> (<div key={s} style={styles.tag}><span>{s}</span><button type="button" onClick={()=>removeSubject(s)} aria-label={`Remove ${s}`} style={{border:'none',background:'transparent',cursor:'pointer'}}><FaTrash/></button></div>))}</div></div></div></div>
              <div><div style={styles.labelSmall}>Percentage / Marks</div><textarea name="percentage" placeholder="Percentage" style={styles.textarea} value={formData.percentage||''} onChange={handleChange} rows={3} aria-label="Percentage"/></div>
            </section>

            <div style={styles.buttonGroup}>
              <button type="button" style={styles.button} onClick={()=>setActivePage("extractAadhaar")} aria-label="Extract Aadhaar Text">Extract Aadhaar Text</button>
              <button type="button" style={styles.button} onClick={()=>setActivePage("extractPan")} aria-label="Extract PAN Details">Extract PAN Details</button>
              <button type="button" style={styles.button} onClick={()=>navigate("/extract-marksheet")} aria-label="Extract Marksheet">Extract Marksheet</button>
              <button type="button" style={styles.button} onClick={()=>navigate("/extract-living-certificate")} aria-label="Extract Living Certificate">Extract Living Certificate</button>
              <button type="button" style={styles.button} onClick={()=>navigate("/chat")} aria-label="Chat with RAG Bot">Chat with RAG Bot</button>
            </div>

            <div style={{marginTop:"1.25rem"}}><button type="submit" style={styles.submitButton} aria-label="Submit application">Submit</button></div>
          </form>
        </div>

        <aside style={styles.noticePanel} aria-label="Notifications">
          <div style={styles.noticeHeader}><FaBell style={styles.noticeIcon}/> <strong>Notifications</strong></div>
          <ul style={{paddingLeft:"1.1rem",margin:0}}>
            <li>Form deadline extended till 31st July 2025</li>
            <li>New scheme for backward class students</li>
            <li>Marksheet upload available now</li>
            <li>ID cards will be emailed—please enter your correct email address</li>
            <li>Download your admit card by 25th July 2025</li>
            <li>Exam centre guidelines released; check before reporting</li>
            <li>Upload your recent photograph by 20th July 2025</li>
            <li>Contact support@exam.gov.in for any issues</li>
            <li>Helpline: +91-1800-123-456 for queries</li>
          </ul>
        </aside>
      </div>

      <style>{`@keyframes slide{0%{left:100%}100%{left:-100%}}`}</style>
    </div>
  );
}
