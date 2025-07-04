// import { useState } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

// const App = () => {
//   const [sections, setSections] = useState([]); // Array of {title, content}
//   const [cardId, setCardId] = useState('');
//   const [organizationAbbreviation, setOrganizationAbbreviation] = useState('');
//   const [documentTitle, setDocumentTitle] = useState('');
//   const [status, setStatus] = useState({ message: '', type: '' });
//   const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentVersion, setCurrentVersion] = useState('');
//   const [versionHistory, setVersionHistory] = useState([]);
//   const [assessmentStatus, setAssessmentStatus] = useState('');
//   const [showVersionHistory, setShowVersionHistory] = useState(false);

//   // Helper
//   const showStatus = (message, type = 'loading') => {
//     setStatus({ message, type });
//     if (type === 'success' || type === 'error') {
//       setTimeout(() => setStatus({ message: '', type: '' }), 5000);
//     }
//   };

//   const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

//   // 1. Save Assessment Response
//   const saveAssessmentResponse = async () => {
//     if (!cardId.trim() || !organizationAbbreviation.trim()) {
//       showStatus('Please enter Card ID and Organization Abbreviation', 'error');
//       return;
//     }
//     if (!isValidObjectId(cardId)) {
//       showStatus('Please enter a valid Card ID (24 character hex string)', 'error');
//       return;
//     }
//     setIsLoading(true);
//     showStatus('Saving assessment response...', 'loading');
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/organization/planbuilderassessment/upsert', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzRhYThmYzdkNzVkYjYyNTMyMDgwNyIsImVtYWlsIjoiZGVibWFseWFtYXp1bWRhcjk5QGdtYWlsLmNvbSIsInJvbGUiOiJvcmdhbml6YXRpb25fYWRtaW4iLCJvcmdhbml6YXRpb25fbmFtZSI6Ik9NUiIsImlhdCI6MTc1MTU0NzQ0MSwiZXhwIjoxNzUyMTUyMjQxfQ.-o6JnW4owkc9f8BeS3lFsuF4vYZyLdWhjuWikmHeHxQ' // your token
//         },
//         body: JSON.stringify({
//           card_id: cardId.trim(),
//           responses: { organization_abbreviation: organizationAbbreviation.trim() }
//         })
//       });
//       const data = await response.json();
//       if (data.success) {
//         showStatus('Assessment response saved successfully!', 'success');
//         setAssessmentStatus('In_Progress');
//       } else {
//         showStatus(`Error: ${data.message}`, 'error');
//       }
//     } catch (error) {
//       showStatus(`Failed to save assessment: ${error.message}`, 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 2. Submit Assessment (Create initial template)
//   const submitAssessment = async () => {
//     if (!cardId.trim()) {
//       showStatus('Please enter Card ID first', 'error');
//       return;
//     }
//     setIsLoading(true);
//     showStatus('Creating initial template from master...', 'loading');
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/organization/planbuilderassessment/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzRhYThmYzdkNzVkYjYyNTMyMDgwNyIsImVtYWlsIjoiZGVibWFseWFtYXp1bWRhcjk5QGdtYWlsLmNvbSIsInJvbGUiOiJvcmdhbml6YXRpb25fYWRtaW4iLCJvcmdhbml6YXRpb25fbmFtZSI6Ik9NUiIsImlhdCI6MTc1MTU0NzQ0MSwiZXhwIjoxNzUyMTUyMjQxfQ.-o6JnW4owkc9f8BeS3lFsuF4vYZyLdWhjuWikmHeHxQ'
//         },
//         body: JSON.stringify({ card_id: cardId.trim() })
//       });
//       const data = await response.json();
//       console.log(data)
//       if (data.status) {
//         setSections(data.data.sections || []);
//         setCurrentVersion(data.data.version);
//         setIsDocumentLoaded(true);
//         setAssessmentStatus('Submitted');
//         showStatus(`Template created successfully! Version ${data.data.version} ready for editing.`, 'success');
//       } else {
//         showStatus(`Error: ${data.message}`, 'error');
//       }
//     } catch (error) {
//       showStatus(`Failed to submit assessment: ${error.message}`, 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 3. Load Document for Editing
//   const loadDocumentForEditing = async () => {
//     if (!cardId.trim()) {
//       showStatus('Please enter Card ID', 'error');
//       return;
//     }
//     if (!isValidObjectId(cardId)) {
//       showStatus('Please enter a valid Card ID', 'error');
//       return;
//     }
//     setIsLoading(true);
//     showStatus('Loading document for editing...', 'loading');
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/organization/planbuilderassessment/update', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzRhYThmYzdkNzVkYjYyNTMyMDgwNyIsImVtYWlsIjoiZGVibWFseWFtYXp1bWRhcjk5QGdtYWlsLmNvbSIsInJvbGUiOiJvcmdhbml6YXRpb25fYWRtaW4iLCJvcmdhbml6YXRpb25fbmFtZSI6Ik9NUiIsImlhdCI6MTc1MTU0NzQ0MSwiZXhwIjoxNzUyMTUyMjQxfQ.-o6JnW4owkc9f8BeS3lFsuF4vYZyLdWhjuWikmHeHxQ'
//         },
//         body: JSON.stringify({ card_id: cardId.trim() })
//       });
//       const data = await response.json();
//       console.log(data)
//       if (data.success && data.data) {
//         console.log(data)
//         setSections(data.data.html_content || []);
//         setCurrentVersion(data.data.current_version || '1.0');
//         setAssessmentStatus(data.data.status || '');
//         setIsDocumentLoaded(true);
//         showStatus(`Document loaded! Current version: ${data.data.current_version}`, 'success');
//       } else {
//         showStatus(`Error: ${data.message || 'Document not found'}`, 'error');
//       }
//     } catch (error) {
//       showStatus(`Failed to load document: ${error.message}`, 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 4. Preview Document (merge sections)
//   const previewDocument = async () => {
//     if (!isDocumentLoaded || !sections.length) {
//       showStatus('Please load a document first', 'error');
//       return;
//     }
//     const mergedHtml = sections.map(s => s.content ? s.content : (s.html || '')).join('');
//     if (!mergedHtml.trim() || mergedHtml === '<p>&nbsp;</p>') {
//       showStatus('Document appears to be empty. Please add some content.', 'error');
//       return;
//     }
//     setIsLoading(true);
//     showStatus('Generating PDF preview...', 'loading');
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/organization/planbuilderassessment/preview', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json; charset=utf-8',
//           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzRhYThmYzdkNzVkYjYyNTMyMDgwNyIsImVtYWlsIjoiZGVibWFseWFtYXp1bWRhcjk5QGdtYWlsLmNvbSIsInJvbGUiOiJvcmdhbml6YXRpb25fYWRtaW4iLCJvcmdhbml6YXRpb25fbmFtZSI6Ik9NUiIsImlhdCI6MTc1MTU0NzQ0MSwiZXhwIjoxNzUyMTUyMjQxfQ.-o6JnW4owkc9f8BeS3lFsuF4vYZyLdWhjuWikmHeHxQ'
//         },
//         body: JSON.stringify({
//           html: mergedHtml,
//           filename: documentTitle || `plan_v${currentVersion}`,
//           card_id: cardId.trim(),
//         })
//       });
//       if (response.ok) {
//         const blob = await response.blob();
//         if (blob.size === 0) throw new Error('Generated PDF file is empty');
//         const url = window.URL.createObjectURL(blob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `${documentTitle || 'plan'}-preview-v${currentVersion}.pdf`;
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//         window.URL.revokeObjectURL(url);
//         showStatus('PDF preview downloaded successfully!', 'success');
//       } else {
//         const errorData = await response.json().catch(() => ({ message: 'Unknown server error' }));
//         showStatus(`Error: ${errorData.message}`, 'error');
//       }
//     } catch (error) {
//       showStatus(`Failed to generate preview: ${error.message}`, 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 5. Publish Version (merge sections)
//   const publishVersion = async () => {
//     if (!isDocumentLoaded || !sections.length || !cardId) {
//       showStatus('Please load and edit a document first', 'error');
//       return;
//     }
//     const mergedHtml = sections.map(s => s.content).join('');
//     setIsLoading(true);
//     showStatus('Publishing version...', 'loading');
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/organization/planbuilderassessment/publish', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzRhYThmYzdkNzVkYjYyNTMyMDgwNyIsImVtYWlsIjoiZGVibWFseWFtYXp1bWRhcjk5QGdtYWlsLmNvbSIsInJvbGUiOiJvcmdhbml6YXRpb25fYWRtaW4iLCJvcmdhbml6YXRpb25fbmFtZSI6Ik9NUiIsImlhdCI6MTc1MTU0NzQ0MSwiZXhwIjoxNzUyMTUyMjQxfQ.-o6JnW4owkc9f8BeS3lFsuF4vYZyLdWhjuWikmHeHxQ'
//         },
//         body: JSON.stringify({
//           card_id: cardId.trim(),
//           edited_html: mergedHtml
//         })
//       });
//       const data = await response.json();
//       if (data.status) {
//         showStatus(`Version ${data.data.published_version} published successfully! New version ${data.data.new_current_version} created.`, 'success');
//         setCurrentVersion(data.data.new_current_version);
//         setTimeout(() => loadDocumentForEditing(), 2000);
//       } else {
//         showStatus(`Error: ${data.message}`, 'error');
//       }
//     } catch (error) {
//       showStatus(`Failed to publish version: ${error.message}`, 'error');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // 6. Load Version History
//   const loadVersionHistory = async () => {
//     if (!cardId.trim()) {
//       showStatus('Please enter Card ID first', 'error');
//       return;
//     }
//     try {
//       const response = await fetch('http://localhost:7000/api/v1/organization/planbuilderassessment/version-history', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzRhYThmYzdkNzVkYjYyNTMyMDgwNyIsImVtYWlsIjoiZGVibWFseWFtYXp1bWRhcjk5QGdtYWlsLmNvbSIsInJvbGUiOiJvcmdhbml6YXRpb25fYWRtaW4iLCJvcmdhbml6YXRpb25fbmFtZSI6Ik9NUiIsImlhdCI6MTc1MTU0NzQ0MSwiZXhwIjoxNzUyMTUyMjQxfQ.-o6JnW4owkc9f8BeS3lFsuF4vYZyLdWhjuWikmHeHxQ'
//         },
//         body: JSON.stringify({ card_id: cardId.trim() })
//       });
//       const data = await response.json();
//       if (data.success) {
//         setVersionHistory(data.data.versions || []);
//         setShowVersionHistory(true);
//         showStatus(`Loaded ${data.data.total_versions} versions`, 'success');
//       } else {
//         showStatus(`Error: ${data.message}`, 'error');
//       }
//     } catch (error) {
//       showStatus(`Failed to load version history: ${error.message}`, 'error');
//     }
//   };

//   const clearEditor = () => {
//     setSections([]);
//     setIsDocumentLoaded(false);
//     setCardId('');
//     setOrganizationAbbreviation('');
//     setDocumentTitle('');
//     setCurrentVersion('');
//     setAssessmentStatus('');
//     setVersionHistory([]);
//     setShowVersionHistory(false);
//     showStatus('Editor cleared', 'success');
//   };

//   // const editorConfiguration = {
//   //   toolbar: {
//   //     items: [
//   //       'heading', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
//   //       'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
//   //       'alignment', '|', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|',
//   //       'todoList', 'link', 'blockQuote', 'insertTable', '|', 'undo', 'redo', '|',
//   //       'findAndReplace', 'selectAll'
//   //     ],
//   //     shouldNotGroupWhenFull: true
//   //   },
//   //   language: 'en',
//   //   table: {
//   //     contentToolbar: [
//   //       'tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties'
//   //     ]
//   //   },
//   //   licenseKey: '',
//   //   placeholder: 'Your plan content will appear here after submission...'
//   // };

//   const editorConfiguration = {
//     toolbar: {
//       items: [
//         'heading', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
//         'fontSize', 'fontFamily', 'fontColor', 'fontBackgroundColor', '|',
//         'alignment', '|', 'numberedList', 'bulletedList', '|', 'outdent', 'indent', '|',
//         'todoList', 'link', 'blockQuote', 'insertTable', '|', 'undo', 'redo', '|',
//         'findAndReplace', 'selectAll'
//       ],
//       shouldNotGroupWhenFull: true
//     },
//     language: 'en',
//     table: {
//       contentToolbar: [
//         'tableColumn', 'tableRow', 'mergeTableCells', 'tableCellProperties', 'tableProperties'
//       ]
//     },
//     licenseKey: '',
//     placeholder: 'Your plan content will appear here after submission...',
//     // --- Add your custom styles here ---
//     contentStyle: `body {
//             font-family: 'Segoe UI', Arial, sans-serif;
//             background: #f8f9fa;
//             color: #222;
//             margin: 0;
//             padding: 0;
//         }

//         .container {
//             max-width: 900px;
//             margin: 40px auto;
//             background: #fff;
//             padding: 40px 32px;
//             border-radius: 10px;
//             box-shadow: 0 2px 16px rgba(0, 0, 0, 0.07);
//         }

//         .drp-header {
//             background: linear-gradient(90deg, #f1f5f9 0%, #e0e7ef 100%);
//             border-radius: 12px;
//             box-shadow: 0 4px 24px rgba(30, 64, 175, 0.07);
//             padding: 28px 24px 18px 24px;
//             margin-bottom: 32px;
//         }

//         .drp-header h1 {
//             font-size: 2.2em;
//             font-weight: 800;
//             color: #1e293b;
//             margin-bottom: 10px;
//             letter-spacing: 1px;
//         }

//         .drp-meta {
//             display: flex;
//             flex-wrap: wrap;
//             gap: 24px;
//             font-size: 1.08rem;
//             color: #334155;
//             margin-bottom: 10px;
//         }

//         .drp-meta>div {
//             min-width: 180px;
//         }

//         .drp-confidential {
//             display: flex;
//             align-items: flex-start;
//             gap: 14px;
//             background: #fff0f1;
//             border-left: 6px solid #e11d48;
//             border-radius: 8px;
//             padding: 14px 18px;
//             margin-top: 18px;
//             color: #b91c1c;
//             font-size: 1.08rem;
//             box-shadow: 0 2px 8px rgba(225, 29, 72, 0.04);
//         }

//         .drp-lock {
//             font-size: 2.1rem;
//             margin-top: 2px;
//         }

//         h2 {
//             color: #2a3b4c;
//             font-size: 1.5em;
//             border-bottom: 1px solid #e0e0e0;
//             padding-bottom: 0.2em;
//             margin-top: 2em;
//             margin-bottom: 0.7em;
//         }

//         h3 {
//             color: #2a3b4c;
//             font-size: 1.2em;
//             margin-top: 1.5em;
//             margin-bottom: 0.5em;
//         }

//         p {
//             line-height: 1.7;
//             margin: 0.7em 0;
//         }

//         ul,
//         ol {
//             margin: 0.7em 0 1.5em 1.5em;
//             padding: 0;
//         }

//         li {
//             margin-bottom: 0.5em;
//         }

//         .section {
//             margin-bottom: 2.5em;
//         }

//         table {
//             width: 100%;
//             border-collapse: collapse;
//             margin: 1.5em 0;
//             background: #fafbfc;
//             border-radius: 8px;
//             overflow: hidden;
//             box-shadow: 0 1px 4px rgba(30, 64, 175, 0.04);
//         }

//         th,
//         td {
//             border: 1px solid #d1d5db;
//             padding: 10px 14px;
//             text-align: left;
//             font-size: 1em;
//         }

//         th {
//             background: #e5e7eb;
//             font-weight: 600;
//             color: #1e293b;
//         }

//         .footer {
//             text-align: center;
//             color: #888;
//             font-size: 0.95em;
//             margin-top: 3em;
//             padding-top: 2em;
//             border-top: 1px solid #e0e0e0;
//         }

//         @media (max-width: 600px) {
//             .container {
//                 padding: 12px;
//             }

//             .drp-header {
//                 padding: 12px 6px;
//             }

//             .drp-header h1 {
//                 font-size: 1.3em;
//             }

//             .drp-meta {
//                 gap: 10px;
//                 font-size: 0.98rem;
//             }

//             .drp-confidential {
//                 font-size: 0.98rem;
//                 padding: 8px 6px;
//             }

//             th,
//             td {
//                 font-size: 0.95em;
//             }
//         }

//         /* Print styles must be outside of other media queries! */
//         @media print {

//             body,
//             html {
//                 background: #fff !important;
//                 margin: 0 !important;
//                 padding: 0 !important;
//             }

//             .container {
//                 max-width: 100% !important;
//                 margin: 0 !important;
//                 padding: 0.1in !important;
//                 /* minimal padding */
//                 box-shadow: none !important;
//                 border-radius: 0 !important;
//                 background: #fff !important;
//             }
//         }`,
//     htmlSupport: {
//       allow: [
//         {
//           name: /.*/,
//           attributes: true,
//           classes: true,
//           styles: true
//         }
//       ]
//     }
//   };

//   return (
//     <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '32px', color: '#1f2937', textAlign: 'center' }}>
//         📋 Plan Builder Editor
//       </h1>
//       {/* Assessment Setup Section */}
//       <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
//         <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
//           🎯 Assessment Setup
//         </h3>
//         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
//           <div>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
//               Card ID: *
//             </label>
//             <input
//               type="text"
//               value={cardId}
//               onChange={(e) => setCardId(e.target.value)}
//               placeholder="60f1b2b3c4d5e6f7a8b9c0d1"
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 border: `1px solid ${!cardId || isValidObjectId(cardId) ? '#d1d5db' : '#ef4444'}`,
//                 borderRadius: '8px',
//                 fontSize: '14px'
//               }}
//             />
//             {cardId && !isValidObjectId(cardId) && (
//               <p style={{ color: '#ef4444', fontSize: '12px', marginTop: '4px' }}>
//                 Please enter a valid 24-character ObjectId
//               </p>
//             )}
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
//               Organization Abbreviation: *
//             </label>
//             <input
//               type="text"
//               value={organizationAbbreviation}
//               onChange={(e) => setOrganizationAbbreviation(e.target.value)}
//               placeholder="ACME"
//               maxLength={10}
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 border: '1px solid #d1d5db',
//                 borderRadius: '8px',
//                 fontSize: '14px'
//               }}
//             />
//           </div>
//           <div>
//             <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
//               Document Title:
//             </label>
//             <input
//               type="text"
//               value={documentTitle}
//               onChange={(e) => setDocumentTitle(e.target.value)}
//               placeholder="Business Continuity Plan"
//               maxLength={100}
//               style={{
//                 width: '100%',
//                 padding: '12px',
//                 border: '1px solid #d1d5db',
//                 borderRadius: '8px',
//                 fontSize: '14px'
//               }}
//             />
//           </div>
//         </div>
//         {(currentVersion || assessmentStatus) && (
//           <div style={{
//             padding: '12px',
//             backgroundColor: '#e0f2fe',
//             borderRadius: '8px',
//             marginBottom: '16px',
//             border: '1px solid #0891b2'
//           }}>
//             <div style={{ display: 'flex', gap: '20px', fontSize: '14px', color: '#0c4a6e' }}>
//               {currentVersion && <span><strong>Version:</strong> {currentVersion}</span>}
//               {assessmentStatus && <span><strong>Status:</strong> {assessmentStatus}</span>}
//             </div>
//           </div>
//         )}
//         <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
//           <button onClick={saveAssessmentResponse} disabled={isLoading || !cardId || !organizationAbbreviation}
//             style={{
//               backgroundColor: (isLoading || !cardId || !organizationAbbreviation) ? '#9ca3af' : '#3b82f6',
//               color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
//               cursor: (isLoading || !cardId || !organizationAbbreviation) ? 'not-allowed' : 'pointer',
//               fontSize: '14px', fontWeight: '600'
//             }}>
//             💾 Save Response
//           </button>
//           <button onClick={submitAssessment} disabled={isLoading || !cardId}
//             style={{
//               backgroundColor: (isLoading || !cardId) ? '#9ca3af' : '#10b981',
//               color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
//               cursor: (isLoading || !cardId) ? 'not-allowed' : 'pointer',
//               fontSize: '14px', fontWeight: '600'
//             }}>
//             🚀 Submit & Create Template
//           </button>
//           <button onClick={loadDocumentForEditing} disabled={isLoading || !cardId}
//             style={{
//               backgroundColor: (isLoading || !cardId) ? '#9ca3af' : '#f59e0b',
//               color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
//               cursor: (isLoading || !cardId) ? 'not-allowed' : 'pointer',
//               fontSize: '14px', fontWeight: '600'
//             }}>
//             📂 Load for Editing
//           </button>
//           <button onClick={loadVersionHistory} disabled={isLoading || !cardId}
//             style={{
//               backgroundColor: (isLoading || !cardId) ? '#9ca3af' : '#8b5cf6',
//               color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
//               cursor: (isLoading || !cardId) ? 'not-allowed' : 'pointer',
//               fontSize: '14px', fontWeight: '600'
//             }}>
//             📚 Version History
//           </button>
//           <button onClick={clearEditor} disabled={isLoading}
//             style={{
//               backgroundColor: isLoading ? '#9ca3af' : '#6b7280',
//               color: 'white', padding: '10px 20px', borderRadius: '8px', border: 'none',
//               cursor: isLoading ? 'not-allowed' : 'pointer',
//               fontSize: '14px', fontWeight: '600'
//             }}>
//             🗑️ Clear
//           </button>
//         </div>
//       </div>
//       {/* Version History */}
//       {showVersionHistory && versionHistory.length > 0 && (
//         <div style={{ marginBottom: '32px', padding: '24px', backgroundColor: '#fef7ff', borderRadius: '12px', border: '1px solid #d8b4fe' }}>
//           <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
//             📚 Version History
//           </h3>
//           <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
//             {versionHistory.map((version, index) => (
//               <div key={index} style={{
//                 padding: '12px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '8px', border: '1px solid #e5e7eb'
//               }}>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//                   <span style={{ fontWeight: '600', color: '#7c3aed' }}>Version {version.version}</span>
//                   <span style={{ fontSize: '12px', color: '#6b7280' }}>
//                     {new Date(version.published_at).toLocaleString()}
//                   </span>
//                 </div>
//               </div>
//             ))}
//           </div>
//           <button onClick={() => setShowVersionHistory(false)}
//             style={{
//               marginTop: '12px', backgroundColor: '#6b7280', color: 'white', padding: '8px 16px',
//               borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px'
//             }}>
//             Hide History
//           </button>
//         </div>
//       )}
//       {/* Status Messages */}
//       {status.message && (
//         <div style={{
//           padding: '16px', marginBottom: '24px', borderRadius: '8px',
//           backgroundColor:
//             status.type === 'success' ? '#dcfce7' :
//               status.type === 'error' ? '#fef2f2' :
//                 status.type === 'warning' ? '#fef3c7' : '#dbeafe',
//           color:
//             status.type === 'success' ? '#166534' :
//               status.type === 'error' ? '#991b1b' :
//                 status.type === 'warning' ? '#92400e' : '#1e40af',
//           border: `1px solid ${status.type === 'success' ? '#bbf7d0' :
//             status.type === 'error' ? '#fecaca' :
//               status.type === 'warning' ? '#fde68a' : '#bfdbfe'
//             }`,
//           fontWeight: '500'
//         }}>
//           {status.message}
//         </div>
//       )}


//       {/* Section Editors */ console.log(sections)}
//       <div style={{ marginBottom: '32px' }}>
//         <h3 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
//           ✏️ Plan Editor {currentVersion && `(Version ${currentVersion})`}
//         </h3>
//         {sections.length === 0 && (
//           <div style={{ color: '#6b7280', fontStyle: 'italic', marginBottom: 24 }}>
//             No sections loaded. Please load or submit a document.
//           </div>
//         )}
//         {sections.map((section, idx) => (
//           <div key={idx} style={{ marginBottom: 32, background: '#fff', borderRadius: 8, padding: 16, border: '1px solid #e5e7eb' }}>
//             <h4 style={{ fontWeight: 600, marginBottom: 8 }}>{section.title || `Section ${idx + 1}`}</h4>
//             <CKEditor
//               editor={ClassicEditor}
//               config={editorConfiguration}
//               data={section.html}
//               onChange={(event, editor) => {
//                 const data = editor.getData();
//                 setSections(prevSections => {
//                   const updated = [...prevSections];
//                   updated[idx] = { ...updated[idx], content: data };
//                   return updated;
//                 });
//               }}
//             />
//           </div>
//         ))}
//       </div>
//       {/* Action Buttons */}
//       <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', paddingTop: '24px', flexWrap: 'wrap' }}>
//         <button onClick={previewDocument} disabled={!isDocumentLoaded || isLoading || !sections.length}
//           style={{
//             backgroundColor: (!isDocumentLoaded || isLoading || !sections.length) ? '#9ca3af' : '#10b981',
//             color: 'white', padding: '12px 32px', borderRadius: '8px', border: 'none',
//             cursor: (!isDocumentLoaded || isLoading || !sections.length) ? 'not-allowed' : 'pointer',
//             fontSize: '16px', fontWeight: '600'
//           }}>
//           {isLoading ? '⏳ Processing...' : '📄 Preview PDF'}
//         </button>
//         <button onClick={publishVersion} disabled={!isDocumentLoaded || isLoading || !sections.length}
//           style={{
//             backgroundColor: (!isDocumentLoaded || isLoading || !sections.length) ? '#9ca3af' : '#dc2626',
//             color: 'white', padding: '12px 32px', borderRadius: '8px', border: 'none',
//             cursor: (!isDocumentLoaded || isLoading || !sections.length) ? 'not-allowed' : 'pointer',
//             fontSize: '16px', fontWeight: '600'
//           }}>
//           {isLoading ? '⏳ Publishing...' : '🚀 Publish Version'}
//         </button>
//       </div>
//       {/* Workflow Info */}
//       <div style={{ marginTop: '48px', padding: '24px', backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
//         <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '16px', color: '#1f2937' }}>
//           📋 Plan Builder Workflow
//         </h4>
//         <div style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6' }}>
//           <p><strong>Step 1:</strong> Enter Card ID and Organization Abbreviation → Click "Save Response"</p>
//           <p><strong>Step 2:</strong> Click "Submit & Create Template" → This populates the master template with your data</p>
//           <p><strong>Step 3:</strong> Edit the content in each section below → Add colors, formatting, etc.</p>
//           <p><strong>Step 4:</strong> Click "Preview PDF" → Download and review your changes</p>
//           <p><strong>Step 5:</strong> Click "Publish Version" → Saves your final version and creates next version</p>
//           <p><strong>Note:</strong> Each time you load for editing, you'll get the original populated template (not previous edits)</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;



// src/App.js
import React, { useState, useEffect, useRef } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';

const API_BASE = 'http://localhost:7000/api/v1/organization/planbuilderassessment';
const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MzRhYThmYzdkNzVkYjYyNTMyMDgwNyIsImVtYWlsIjoiZGVibWFseWFtYXp1bWRhcjk5QGdtYWlsLmNvbSIsInJvbGUiOiJvcmdhbml6YXRpb25fYWRtaW4iLCJvcmdhbml6YXRpb25fbmFtZSI6Ik9NUiIsImlhdCI6MTc1MTU0NzQ0MSwiZXhwIjoxNzUyMTUyMjQxfQ.-o6JnW4owkc9f8BeS3lFsuF4vYZyLdWhjuWikmHeHxQ'; // Replace with your real token

const App = () => {
  const [cardId, setCardId] = useState('');
  const [sections, setSections] = useState([]);
  const [currentVersion, setCurrentVersion] = useState('1.0');
  const [isDocumentLoaded, setIsDocumentLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState('');
  const editorRef = useRef(null);
  const mergedHtmlForPreview = useRef('');

  const showStatus = (msg, type = 'info') => {
    setStatus(`${type.toUpperCase()}: ${msg}`);
  };

  const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

  const loadDocumentForEditing = async () => {
    if (!cardId.trim()) return showStatus('Please enter Card ID', 'error');
    if (!isValidObjectId(cardId)) return showStatus('Invalid Card ID', 'error');

    setIsLoading(true);
    showStatus('Loading document...');
    try {
      const response = await fetch(`${API_BASE}/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify({ card_id: cardId.trim() }),
      });

      const data = await response.json();
      if (data.success && data.data) {
        const htmlSections = data.data.html_content || [];
        const combinedHtml = htmlSections.map(s => s.content || s.html || '').join('<hr/>');

        setSections(htmlSections);
        setCurrentVersion(data.data.current_version || '1.0');
        setIsDocumentLoaded(true);
        showStatus('Document loaded successfully', 'success');

        if (!editorRef.current) {
          editorRef.current = grapesjs.init({
            container: '#gjs',
            fromElement: false,
            height: '100vh',
            components: combinedHtml,
            storageManager: false,
            plugins: ['gjs-preset-webpage'],
          });
        } else {
          editorRef.current.setComponents(combinedHtml);
        }
      } else {
        showStatus(data.message || 'Document not found', 'error');
      }
    } catch (err) {
      showStatus(`Error loading document: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };
const handleSave = () => {
  if (!editorRef.current) return showStatus('Editor not ready', 'error');

  const rawHtml = editorRef.current.getHtml();
  const css = editorRef.current.getCss();

  // Remove GrapesJS metadata
  const cleanedHtml = rawHtml.replace(/\s(data-gjs-[^=]+|contenteditable)="[^"]*"/g, '');

  const fullHtml = `
    <html>
      <head>
        <style>${css}</style>
      </head>
      <body>
        <div class="container">
          ${cleanedHtml}
        </div>
      </body>
    </html>
  `;

  mergedHtmlForPreview.current = fullHtml;
  setSections([{ title: 'Merged', content: cleanedHtml }]);
  showStatus('Content saved. Now you can preview or publish.', 'success');
};


  const previewDocument = async () => {
    if (!isDocumentLoaded || !sections.length) return showStatus('Please load a document first', 'error');
    if (!mergedHtmlForPreview.current) return showStatus('Please save the document before previewing', 'error');

    setIsLoading(true);
    showStatus('Generating PDF preview...');
    try {
      const response = await fetch(`${API_BASE}/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify({
         html: mergedHtmlForPreview.current, 
          filename: `plan_v${currentVersion}`,
          card_id: cardId.trim(),
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plan-preview-v${currentVersion}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showStatus('PDF preview downloaded', 'success');
      } else {
        const err = await response.json();
        showStatus(`Preview error: ${err.message}`, 'error');
      }
    } catch (error) {
      showStatus(`Preview failed: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const publishVersion = async () => {
    if (!isDocumentLoaded || !sections.length || !cardId) {
      return showStatus('Please load and edit a document first', 'error');
    }

    const mergedHtml = sections.map(s => s.content).join('');
    setIsLoading(true);
    showStatus('Publishing version...');
    try {
      const response = await fetch(`${API_BASE}/publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: AUTH_TOKEN,
        },
        body: JSON.stringify({
          card_id: cardId.trim(),
          edited_html: mergedHtml,
        }),
      });

      const data = await response.json();
      if (data.status) {
        showStatus(`Version ${data.data.published_version} published. New version: ${data.data.new_current_version}`, 'success');
        setCurrentVersion(data.data.new_current_version);
        setTimeout(loadDocumentForEditing, 1000);
      } else {
        showStatus(`Publish failed: ${data.message}`, 'error');
      }
    } catch (error) {
      showStatus(`Publish error: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div style={{ padding: 20 }}>
        <input
          type="text"
          value={cardId}
          onChange={(e) => setCardId(e.target.value)}
          placeholder="Enter Card ID"
          style={{ padding: 8, width: '300px', marginRight: 10 }}
        />
        <button onClick={loadDocumentForEditing} disabled={isLoading}>Load Document</button>
        <button onClick={handleSave} disabled={!isDocumentLoaded || isLoading}>Save Content</button>
        <button onClick={previewDocument} disabled={!isDocumentLoaded || isLoading}>Preview PDF</button>
        <button onClick={publishVersion} disabled={!isDocumentLoaded || isLoading}>Publish Version</button>
        <p style={{ marginTop: 10 }}>{status}</p>
      </div>

      <div id="gjs" />
    </div>
  );
};

export default App;
