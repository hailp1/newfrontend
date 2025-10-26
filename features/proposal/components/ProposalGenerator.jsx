import React from 'react';
import { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';

// Component con cho các khung nhập liệu
const FormSection = ({ title, children }) => (
  <div className="mb-6 p-4 border border-gray-300 rounded-lg">
    <h3 className="text-lg font-semibold mb-3 text-gray-800">{title}</h3>
    {children}
  </div>
);

// Component chính
const ProposalGenerator = () => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    introduction: '',
    methodology: '',
    expectedResults: '',
    timeline: '',
    budget: '',
    references: ''
  });

  const [preview, setPreview] = useState('');
  const previewRef = useRef(null);

  // Cập nhật preview khi formData thay đổi
  useEffect(() => {
    const markdown = `# ${formData.title}

## Abstract
${formData.abstract}

## Introduction
${formData.introduction}

## Methodology
${formData.methodology}

## Expected Results
${formData.expectedResults}

## Timeline
${formData.timeline}

## Budget
${formData.budget}

## References
${formData.references}`;
    
    setPreview(markdown);
  }, [formData]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePDF = async () => {
    if (!previewRef.current) return;
    
    try {
      const canvas = await html2canvas(previewRef.current);
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF();
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      pdf.save('proposal.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const generateWord = () => {
    // Tạo nội dung Word đơn giản
    const content = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${formData.title}</title>
        </head>
        <body>
          <h1>${formData.title}</h1>
          <h2>Abstract</h2>
          <p>${formData.abstract}</p>
          <h2>Introduction</h2>
          <p>${formData.introduction}</p>
          <h2>Methodology</h2>
          <p>${formData.methodology}</p>
          <h2>Expected Results</h2>
          <p>${formData.expectedResults}</p>
          <h2>Timeline</h2>
          <p>${formData.timeline}</p>
          <h2>Budget</h2>
          <p>${formData.budget}</p>
          <h2>References</h2>
          <p>${formData.references}</p>
        </body>
      </html>
    `;
    
    const blob = new Blob([content], { type: 'text/html' });
    saveAs(blob, 'proposal.html');
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
        Proposal Generator
      </h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form nhập liệu */}
        <div className="space-y-6">
          <FormSection title="Basic Information">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter proposal title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Abstract
                </label>
                <textarea
                  value={formData.abstract}
                  onChange={(e) => handleInputChange('abstract', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter abstract"
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Introduction">
            <textarea
              value={formData.introduction}
              onChange={(e) => handleInputChange('introduction', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter introduction"
            />
          </FormSection>

          <FormSection title="Methodology">
            <textarea
              value={formData.methodology}
              onChange={(e) => handleInputChange('methodology', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter methodology"
            />
          </FormSection>

          <FormSection title="Expected Results">
            <textarea
              value={formData.expectedResults}
              onChange={(e) => handleInputChange('expectedResults', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter expected results"
            />
          </FormSection>

          <FormSection title="Timeline">
            <textarea
              value={formData.timeline}
              onChange={(e) => handleInputChange('timeline', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter timeline"
            />
          </FormSection>

          <FormSection title="Budget">
            <textarea
              value={formData.budget}
              onChange={(e) => handleInputChange('budget', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter budget"
            />
          </FormSection>

          <FormSection title="References">
            <textarea
              value={formData.references}
              onChange={(e) => handleInputChange('references', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter references"
            />
          </FormSection>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Preview</h2>
            <div className="space-x-2">
              <button
                onClick={generatePDF}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Export PDF
              </button>
              <button
                onClick={generateWord}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Export HTML
              </button>
            </div>
          </div>
          
          <div 
            ref={previewRef}
            className="border border-gray-300 rounded-lg p-6 bg-white min-h-[600px]"
          >
            <ReactMarkdown>{preview}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalGenerator;
