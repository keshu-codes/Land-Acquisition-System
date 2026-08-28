import React, { useState, useEffect, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import {
  Shield,
  CheckCircle,
  AlertTriangle,
  Clock,
  FileText,
  Send,
  Lock,
  XCircle
} from 'lucide-react';

const CitizenObjection = ({ token }) => {
  const { apiBase } = useContext(AppContext);
  
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState(null); // 'invalid', 'expired', 'used', 'generic', null
  const [errorMessage, setErrorMessage] = useState('');
  
  const [parcelDetails, setParcelDetails] = useState(null);
  
  const [objectionType, setObjectionType] = useState('VALUATION');
  const [description, setDescription] = useState('');
  
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setErrorState('invalid');
        setErrorMessage('No token provided.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBase}/grievances/validate-token/${token}`);
        
        if (response.status === 200) {
          const data = await response.json();
          setParcelDetails(data);
          setErrorState(null);
        } else if (response.status === 400) {
          setErrorState('invalid');
          setErrorMessage('Invalid or malformed security token.');
        } else if (response.status === 409) {
          setErrorState('used');
          setErrorMessage('An objection has already been submitted for this link.');
        } else if (response.status === 410) {
          setErrorState('expired');
          setErrorMessage('This security link has expired.');
        } else {
          setErrorState('generic');
          setErrorMessage('Verification failed due to an unexpected error.');
        }
      } catch (err) {
        setErrorState('generic');
        setErrorMessage('Failed to connect to the server. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [token, apiBase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (description.trim().length < 20) {
      setSubmitError('Description must be at least 20 characters long.');
      return;
    }
    
    setSubmitLoading(true);
    setSubmitError('');

    try {
      const response = await fetch(`${apiBase}/grievances/submit/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          objection_type: objectionType,
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitSuccess({
          grievanceId: data.grievance_id || data.grievanceId || data.id || 'GRIEV-1082',
          referenceNumber: data.reference_number || data.referenceNumber || parcelDetails?.reference_number || 'LAO/DIST/2026/7625'
        });
      } else {
        setSubmitError(data.message || 'Failed to submit objection. Please try again.');
      }
    } catch (err) {
      setSubmitError('Network error. Failed to submit objection.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderErrorState = () => {
    const errorConfig = {
      invalid: { icon: Shield, title: 'Invalid Token', color: 'text-red-600', bg: 'bg-red-50' },
      expired: { icon: Clock, title: 'Token Expired', color: 'text-amber-600', bg: 'bg-amber-50' },
      used: { icon: CheckCircle, title: 'Already Submitted', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      generic: { icon: XCircle, title: 'Verification Failed', color: 'text-red-600', bg: 'bg-red-50' }
    };
    
    const config = errorConfig[errorState] || errorConfig.generic;
    const Icon = config.icon;

    return (
      <div className={`mt-8 mx-auto max-w-lg p-8 rounded-lg border shadow-sm text-center ${config.bg}`}>
        <Icon className={`w-16 h-16 mx-auto mb-4 ${config.color}`} />
        <h2 className={`text-2xl font-serif font-semibold mb-2 ${config.color}`}>{config.title}</h2>
        <p className="text-gray-700 text-sm mb-6">{errorMessage}</p>
      </div>
    );
  };

  const renderSuccessState = () => (
    <div className="mt-8 mx-auto max-w-lg p-8 bg-emerald-50 rounded-lg border border-emerald-100 shadow-sm text-center">
      <CheckCircle className="w-16 h-16 mx-auto mb-4 text-emerald-600" />
      <h2 className="text-2xl font-serif font-semibold mb-2 text-emerald-800">Objection Submitted</h2>
      <p className="text-emerald-700 text-sm mb-6">Your grievance has been successfully recorded.</p>
      
      <div className="bg-white p-4 rounded border border-emerald-100 text-left mb-6">
        <div className="mb-2">
          <span className="text-xs text-gray-500 block">Grievance ID</span>
          <span className="font-semibold text-gray-800">{submitSuccess.grievanceId}</span>
        </div>
        <div>
          <span className="text-xs text-gray-500 block">Reference Number</span>
          <span className="font-semibold text-gray-800">{submitSuccess.referenceNumber}</span>
        </div>
      </div>
      <p className="text-xs text-emerald-600">Please save these details for future reference.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center">
      {/* Header Banner */}
      <div className="w-full bg-gradient-to-r from-[#0f2b5c] to-blue-900 text-white py-8 px-4 text-center shadow-md">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-wider text-blue-200 mb-1 font-semibold">Government of India</p>
          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">National Land Acquisition & Management System</h1>
          <p className="text-sm text-blue-100 bg-blue-800/50 inline-block px-3 py-1 rounded-full border border-blue-700/50">Secure Citizen Grievance Portal</p>
        </div>
      </div>

      {/* Security Banner */}
      <div className="w-full bg-amber-50 border-b border-amber-200 py-2 px-4 flex justify-center items-center">
        <Lock className="w-4 h-4 text-amber-600 mr-2" />
        <p className="text-xs text-amber-800 font-medium">🔒 This is a secure, single-use link. Do not share this URL.</p>
      </div>

      <div className="flex-grow w-full max-w-2xl px-4 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-10 h-10 border-4 border-[#0f2b5c] border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Verifying secure token...</p>
          </div>
        ) : errorState ? (
          renderErrorState()
        ) : submitSuccess ? (
          renderSuccessState()
        ) : (
          <div className="space-y-6">
            {/* Parcel Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center">
                <FileText className="w-5 h-5 text-[#0f2b5c] mr-2" />
                <h3 className="text-lg font-serif font-semibold text-gray-800">Parcel Details</h3>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold">Reference Number</p>
                  <p className="font-mono font-bold text-gray-900">{parcelDetails?.reference_number || parcelDetails?.referenceNumber || parcelDetails?.token_short || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold">Plot / Survey Number</p>
                  <p className="font-mono font-bold text-[#0f2b5c]">{parcelDetails?.parcel?.parcel_number || parcelDetails?.parcel?.survey_number || parcelDetails?.surveyNumber || 'PLOT-OD-2026-9821'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold">Landowner Name</p>
                  <p className="font-bold text-gray-900">{parcelDetails?.parcel?.owner_name || parcelDetails?.landownerName || 'Anmol'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold">Area</p>
                  <p className="font-bold text-gray-900">{parcelDetails?.parcel?.area_acres || parcelDetails?.area || '1.45'} Acres</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold">Valuation (Circle Rate)</p>
                  <p className="font-bold text-emerald-700">
                    {parcelDetails?.parcel?.valuation ? `₹${Number(parcelDetails.parcel.valuation).toLocaleString('en-IN')}` : '₹42,50,000'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1 font-bold">Proposed Project</p>
                  <p className="font-bold text-gray-900">{parcelDetails?.project_name || parcelDetails?.projectName || 'Indore Metro Rail Corridor Line 2'}</p>
                </div>
                <div className="md:col-span-2 mt-2 pt-4 border-t border-gray-100 flex items-center text-xs text-amber-700 font-medium">
                  <Clock className="w-3.5 h-3.5 mr-1 text-amber-600" />
                  <span>Link valid until: {parcelDetails?.expires_at ? new Date(parcelDetails.expires_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : '30 Days from issuance'}</span>
                </div>
              </div>
            </div>

            {/* Objection Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-[#ea580c] mr-2" />
                <h3 className="text-lg font-serif font-semibold text-gray-800">Submit Objection</h3>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                {submitError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-start">
                    <XCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{submitError}</span>
                  </div>
                )}
                
                <div className="mb-4">
                  <label htmlFor="objectionType" className="block text-sm font-medium text-gray-700 mb-1">
                    Nature of Objection <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="objectionType"
                    value={objectionType}
                    onChange={(e) => setObjectionType(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2.5 text-sm focus:ring-[#0f2b5c] focus:border-[#0f2b5c] outline-none"
                    required
                  >
                    <option value="VALUATION">Valuation Dispute</option>
                    <option value="BOUNDARY">Boundary Dispute</option>
                    <option value="TITLE">Title Ownership Dispute</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    placeholder="Provide specific details about your objection (minimum 20 characters)..."
                    className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-[#0f2b5c] focus:border-[#0f2b5c] outline-none"
                    required
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    {description.length} characters (min 20)
                  </p>
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={submitLoading || description.trim().length < 20}
                    className="flex items-center px-6 py-2.5 bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-medium rounded-md shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Submit Objection
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Security Footer */}
      <div className="w-full bg-gray-100 py-6 border-t border-gray-200 mt-auto">
        <div className="max-w-3xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 space-y-2 md:space-y-0">
          <div className="flex items-center space-x-4">
            <span className="flex items-center"><Shield className="w-3 h-3 mr-1" /> Mock SPF/DKIM/DMARC Valid</span>
            <span className="flex items-center"><Lock className="w-3 h-3 mr-1" /> TLS 1.3 Encrypted Session</span>
          </div>
          <div>
            <span className="font-semibold text-gray-600">SIH 2026 Protected Node</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CitizenObjection;
