import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { formData } = req.body;
    
    // Generate proposal content
    const proposalContent = {
      title: formData.title || 'Research Proposal',
      abstract: formData.abstract || '',
      introduction: formData.introduction || '',
      methodology: formData.methodology || '',
      expectedResults: formData.expectedResults || '',
      timeline: formData.timeline || '',
      budget: formData.budget || '',
      references: formData.references || ''
    };

    // Return success response
    res.status(200).json({
      success: true,
      message: 'Proposal generated successfully',
      data: proposalContent
    });
  } catch (error) {
    console.error('Error generating proposal:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating proposal',
      error: error.message
    });
  }
}
