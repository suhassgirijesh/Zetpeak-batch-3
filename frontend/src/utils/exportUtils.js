import { jsPDF } from 'jspdf';

/**
 * Export storyboard to PDF
 * @param {Array} scenes - Array of scene objects with image and text
 * @param {string} projectTitle - Title of the project
 */
export const exportStoryboardToPDF = async (scenes, projectTitle = 'Storyboard') => {
  try {
    // Create new PDF document (A4 size, portrait)
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const contentWidth = pageWidth - (margin * 2);
    
    // Add cover page
    pdf.setFillColor(99, 102, 241); // Primary color
    pdf.rect(0, 0, pageWidth, 60, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(32);
    pdf.setFont('helvetica', 'bold');
    pdf.text(projectTitle, pageWidth / 2, 35, { align: 'center' });
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Storyboard - ${scenes.length} Scene${scenes.length !== 1 ? 's' : ''}`, pageWidth / 2, 47, { align: 'center' });
    
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    const date = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    pdf.text(`Generated on ${date}`, pageWidth / 2, pageHeight - 15, { align: 'center' });

    // Process each scene
    for (let i = 0; i < scenes.length; i++) {
      const scene = scenes[i];
      
      // Add new page for each scene
      pdf.addPage();
      
      // Scene header with gradient background
      pdf.setFillColor(99, 102, 241);
      pdf.rect(0, 0, pageWidth, 30, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`Scene ${i + 1}`, margin, 18);
      
      // Scene image
      const imageY = 40;
      const imageHeight = 120;
      const imageWidth = contentWidth;
      
      try {
        // Convert base64 image to data URL
        const imgData = `data:image/png;base64,${scene.image}`;
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', margin, imageY, imageWidth, imageHeight);
        
        // Add border around image
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.5);
        pdf.rect(margin, imageY, imageWidth, imageHeight);
        
      } catch (error) {
        console.error(`Error adding image for scene ${i + 1}:`, error);
        
        // Add placeholder if image fails
        pdf.setFillColor(240, 240, 240);
        pdf.rect(margin, imageY, imageWidth, imageHeight, 'F');
        pdf.setTextColor(150, 150, 150);
        pdf.setFontSize(12);
        pdf.text('Image unavailable', pageWidth / 2, imageY + (imageHeight / 2), { align: 'center' });
      }
      
      // Scene description
      const descriptionY = imageY + imageHeight + 15;
      
      pdf.setTextColor(60, 60, 60);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Description:', margin, descriptionY);
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(11);
      
      // Split text into lines to fit width
      const lines = pdf.splitTextToSize(scene.text, contentWidth);
      pdf.text(lines, margin, descriptionY + 7);
      
      // Add decorative line
      pdf.setDrawColor(99, 102, 241);
      pdf.setLineWidth(1);
      pdf.line(margin, descriptionY + 7 + (lines.length * 5) + 5, pageWidth - margin, descriptionY + 7 + (lines.length * 5) + 5);
      
      // Add page footer
      pdf.setTextColor(150, 150, 150);
      pdf.setFontSize(9);
      pdf.text(`Scene ${i + 1} of ${scenes.length}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
    }
    
    // Add table of contents on second page
    pdf.insertPage(2);
    pdf.setTextColor(60, 60, 60);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Table of Contents', margin, 25);
    
    pdf.setFontSize(11);
    pdf.setFont('helvetica', 'normal');
    
    let tocY = 40;
    scenes.forEach((scene, index) => {
      if (tocY > pageHeight - 30) {
        pdf.addPage();
        tocY = 25;
      }
      
      const sceneText = scene.text.length > 80 ? scene.text.substring(0, 80) + '...' : scene.text;
      pdf.text(`${index + 1}. ${sceneText}`, margin + 5, tocY);
      
      // Page number (each scene is on its own page starting from page 3)
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Page ${index + 3}`, pageWidth - margin - 20, tocY);
      pdf.setTextColor(60, 60, 60);
      
      tocY += 10;
    });

    // Save the PDF
    const fileName = `${projectTitle.replace(/[^a-z0-9]/gi, '_')}_Storyboard_${new Date().getTime()}.pdf`;
    pdf.save(fileName);
    
    return { success: true, fileName };
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Export all images as individual files
 * @param {Array} scenes - Array of scene objects with image and text
 * @param {string} projectTitle - Title of the project
 */
export const exportStoryboardImages = async (scenes, projectTitle = 'Storyboard') => {
  try {
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    
    const folder = zip.folder(projectTitle);
    
    // Add each image to the zip
    scenes.forEach((scene, index) => {
      const imageName = `scene_${String(index + 1).padStart(2, '0')}.png`;
      
      // Remove the base64 prefix if present
      const base64Data = scene.image.replace(/^data:image\/\w+;base64,/, '');
      
      // Add image to zip
      folder.file(imageName, base64Data, { base64: true });
      
      // Also add a text file with the scene description
      const textName = `scene_${String(index + 1).padStart(2, '0')}.txt`;
      folder.file(textName, `Scene ${index + 1}\n\n${scene.text}`);
    });
    
    // Add a README file
    const readmeContent = `${projectTitle} - Storyboard Export
    
Total Scenes: ${scenes.length}
Generated: ${new Date().toLocaleString()}

This archive contains:
- PNG images for each scene (scene_01.png, scene_02.png, etc.)
- Text descriptions for each scene (scene_01.txt, scene_02.txt, etc.)

Thank you for using CiniKraft Storyboard Generator!
`;
    
    folder.file('README.txt', readmeContent);
    
    // Generate the zip file
    const content = await zip.generateAsync({ 
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 9 }
    });
    
    // Download the zip file
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectTitle.replace(/[^a-z0-9]/gi, '_')}_Images_${new Date().getTime()}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    return { success: true, fileName: link.download };
    
  } catch (error) {
    console.error('Error exporting images:', error);
    return { success: false, error: error.message };
  }
};
