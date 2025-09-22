import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ExtractPage({ setFormData }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [extractedName, setExtractedName] = useState('');
  const [extractedAadhaar, setExtractedAadhaar] = useState('');
  const [responseText, setResponseText] = useState('');

  const navigate = useNavigate();
  const canFill = (extractedName || extractedAadhaar) && responseText === 'Y';

  const onFileChange = e => {
    const f = e.target.files[0];
    setFile(f);
    setPreview(f ? URL.createObjectURL(f) : null);
    setError('');
    setExtractedName('');
    setExtractedAadhaar('');
    setResponseText('');
  };

  const onExtract = async e => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image first');
      return;
    }
    setLoading(true);
    setError('');
    setExtractedName('');
    setExtractedAadhaar('');
    setResponseText('');

    try {
      const fd = new FormData();
      fd.append('image', file);

      const extractRes = await fetch('http://localhost:5000/api/extract', {
        method: 'POST',
        body: fd
      });
      const body = await extractRes.json();
      if (!extractRes.ok) throw new Error(body.error || 'OCR failed');

      const name = body.name?.trim();
      const aadhaar = body.aadhaar_number?.trim();

      if (!name && !aadhaar) {
        setError('No name or Aadhaar number found in OCR output');
        return;
      }
      if (name) setExtractedName(name);
      if (aadhaar) setExtractedAadhaar(aadhaar);

      const classRes = await fetch('http://localhost:5000/api/classify-name', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
      const classBody = await classRes.json();
      if (!classRes.ok) throw new Error(classBody.error || 'Model call failed');

      setResponseText(classBody.response);
    } catch (err) {
      console.error('Error in extract/classify flow:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onFill = () => {
    setFormData(prev => ({
      ...prev,
      name: extractedName,
      aadhaarNumber: extractedAadhaar
    }));
    // Navigate to the FormPage (at /form)
    navigate('/form');
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ backgroundColor: '#007bff' }}>
        <div className="container-fluid">
          <a className="navbar-brand text-white" href="/">Home</a>
        </div>
      </nav>

      <div className="d-flex" style={{ padding: '2rem', backgroundColor: '#f5f5f5', gap: '2rem' }}>
        <div className="card" style={{ flex: '0 0 40%', backgroundColor: '#e8f4fd', border: 'none' }}>
          <div className="card-body">
            <h5 className="card-title">सामान्य प्रश्न / General Queries</h5>
            <ul className="card-text" style={{ fontSize: '0.95rem' }}>
              <li>Make sure the Aadhaar image is clear and uncropped.</li>
              <li>File types supported: .jpg, .jpeg, .png</li>
              <li>Only front side of Aadhaar should be uploaded.</li>
              <li>Ensure name is legible in the photo.</li>
            </ul>
            <button className="btn btn-outline-primary mt-3">Chat with RAG Bot</button>
          </div>
        </div>

        <div className="card shadow" style={{ flex: '0 0 60%', backgroundColor: '#e8f4fd', border: 'none' }}>
          <div className="card-body">
            <h4 className="card-title mb-4">Extract & Verify Aadhaar</h4>

            <div className="p-3 mb-4 rounded" style={{ backgroundColor: '#fff' }}>
              <strong>कैसे काम करता है / How it works:</strong>
              <ol className="mt-2 ps-3">
                <li>Upload Aadhaar card image.</li>
                <li>System will extract name & Aadhaar number.</li>
                <li>Name will be verified by AI model.</li>
                <li>If verified, the Fill button will be enabled.</li>
              </ol>
            </div>

            <form onSubmit={onExtract}>
              <div className="mb-3">
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  onChange={onFileChange}
                  className="form-control"
                />
              </div>
              {preview && (
                <div className="text-center mb-3">
                  <img
                    src={preview}
                    alt="preview"
                    style={{ maxWidth: '100%', maxHeight: 250 }}
                    className="rounded"
                  />
                </div>
              )}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Processing…' : 'Extract & Query Model'}
              </button>
            </form>

            {error && <div className="text-danger mt-3">⚠️ {error}</div>}

            {(extractedName || extractedAadhaar) && (
              <div className="mt-4">
                {extractedName && <p><strong>Extracted Name:</strong> {extractedName}</p>}
                {extractedAadhaar && <p><strong>Extracted Aadhaar Number:</strong> {extractedAadhaar}</p>}
                <div className="mt-2">
                  <p className="mb-1"><strong>Model Response:</strong></p>
                  <pre className="p-3 bg-white rounded">{responseText}</pre>
                </div>
                <button
                  onClick={onFill}
                  disabled={!canFill}
                  className={`btn w-100 mt-3 ${canFill ? 'btn-primary' : 'btn-secondary'}`}
                >
                  Fill into Form
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
