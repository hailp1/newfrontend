"use client";

import { useState, useEffect, useMemo, useRef } from 'react';
import ReactMarkdown from 'react-markdown'; // Import thư viện render Markdown
import jsPDF from 'jspdf'; // Import thư viện tạo PDF
import html2canvas from 'html2canvas'; // Import thư viện "chụp ảnh" HTML
import { saveAs } from 'file-saver'; // Thư viện con của html-to-docx, cần để lưu file
import htmlToDocx from 'html-to-docx'; // Import thư viện tạo Word

// --- COMPONENT CON CHO CÁC KHUNG NHẬP LIỆU ---
const FormSection = ({ title, children }) => (
    <div style={styles.section}>
        <h2 style={styles.sectionTitle}>{title}</h2>
        {children}
    </div>
);

// --- COMPONENT CHÍNH ---
export default function ProposalGenerator() {
    // --- State cho form nhập liệu ---
    const [formData, setFormData] = useState({
        proposalTitle: '', authorName: '', institution: '',
        supervisor: '', background: '', problemStatement: ''
    });
    // --- State cho việc chọn lý thuyết và bộ lọc ---
    const [allTheories, setAllTheories] = useState([]);
    const [selectedTheoryIds, setSelectedTheoryIds] = useState(new Set());
    const [filterOptions, setFilterOptions] = useState({ groups: [], domains: [] });
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedDomain, setSelectedDomain] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    // --- State cho kết quả và trạng thái ---
    const [generatedProposal, setGeneratedProposal] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState('');

    const proposalContentRef = useRef(null); // Ref để tham chiếu đến khu vực nội dung đề cương

    // ===================================================================
    // CÁC HÀM XỬ LÝ SỰ KIỆN VÀ LOGIC
    // ===================================================================

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTheorySelection = (theoryId) => {
        const newSelection = new Set(selectedTheoryIds);
        if (newSelection.has(theoryId)) {
            newSelection.delete(theoryId);
        } else {
            newSelection.add(theoryId);
        }
        setSelectedTheoryIds(newSelection);
    };

    const handleSubmit = async () => {
        if (selectedTheoryIds.size === 0) {
            setStatus('Vui lòng chọn ít nhất một lý thuyết.');
            return;
        }
        setIsLoading(true);
        setStatus('Đang tạo đề cương, vui lòng chờ...');
        setGeneratedProposal('');

        try {
            const response = await fetch('/api/generate-proposal', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ formData, selectedTheoryIds: Array.from(selectedTheoryIds) })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || "Lỗi server không xác định.");
            setGeneratedProposal(result.proposal);
            setStatus('Tạo đề cương thành công!');
        } catch (error) {
            setStatus(`Lỗi: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!generatedProposal) return;
        navigator.clipboard.writeText(generatedProposal);
        setStatus('Đã sao chép vào clipboard!');
        setTimeout(() => setStatus('Tạo đề cương thành công!'), 2000);
    };

    const handleExportPDF = () => {
        const input = proposalContentRef.current;
        if (!input) {
            setStatus('Lỗi: Không tìm thấy nội dung để xuất PDF.');
            return;
        }
        setStatus('Đang tạo file PDF...');
        html2canvas(input, { scale: 2 }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const canvasHeight = (canvas.height * pdfWidth) / canvas.width;
            let position = 0;
            let heightLeft = canvasHeight;
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
            while (heightLeft > 0) {
                position = heightLeft - canvasHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeight);
                heightLeft -= pdf.internal.pageSize.getHeight();
            }
            pdf.save("de_cuong_nghien_cuu.pdf");
            setStatus('Xuất PDF thành công!');
        });
    };

    const handleExportWord = async () => {
        const contentNode = proposalContentRef.current;
        if (!contentNode) {
            setStatus('Lỗi: Không tìm thấy nội dung để xuất Word.');
            return;
        }
        setStatus('Đang tạo file Word...');
        try {
            const htmlString = `<!DOCTYPE html><html><head><meta charset="UTF-8"></head><body>${contentNode.innerHTML}</body></html>`;
            const fileBuffer = await htmlToDocx(htmlString);
            saveAs(fileBuffer, 'de_cuong_nghien_cuu.docx');
            setStatus('Xuất Word thành công!');
        } catch (error) {
            setStatus('Lỗi khi tạo file Word.');
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [theoriesRes, filtersRes] = await Promise.all([
                    fetch('/api/get-theories?group=all&domain=all'),
                    fetch('/api/get-filters')
                ]);
                if (!theoriesRes.ok || !filtersRes.ok) throw new Error("Không thể tải dữ liệu server");
                const theoriesData = await theoriesRes.json();
                const filtersData = await filtersRes.json();
                setAllTheories(theoriesData);
                setFilterOptions(filtersData);
            } catch (error) {
                setStatus(`Lỗi: ${error.message}`);
            }
        };
        loadInitialData();
    }, []);

    const filteredTheories = useMemo(() => {
        return allTheories.filter(t => {
            const groupMatch = selectedGroup === 'all' || t.group === selectedGroup;
            const domainMatch = selectedDomain === 'all' || (t.domain && t.domain.includes(selectedDomain));
            const searchMatch = searchTerm === '' || t.theory.toLowerCase().includes(searchTerm.toLowerCase());
            return groupMatch && domainMatch && searchMatch;
        });
    }, [allTheories, selectedGroup, selectedDomain, searchTerm]);

    // ===================================================================
    // PHẦN RENDER GIAO DIỆN
    // ===================================================================

    return (
        <div style={styles.page}>
            <header style={styles.header}>
                <h1>Trình tạo Đề cương Nghiên cứu</h1>
                <p>Nhập thông tin, chọn khung lý thuyết và để hệ thống hỗ trợ bạn xây dựng đề cương.</p>
            </header>
            
            <main style={styles.main}>
                <div style={styles.leftColumn}>
                    <FormSection title="1. Thông tin chung">
                        <div style={styles.grid}>
                            <input name="proposalTitle" value={formData.proposalTitle} onChange={handleFormChange} placeholder="Tên đề tài nghiên cứu" style={styles.input} />
                            <input name="authorName" value={formData.authorName} onChange={handleFormChange} placeholder="Tên tác giả" style={styles.input} />
                            <input name="institution" value={formData.institution} onChange={handleFormChange} placeholder="Trường / Tổ chức" style={styles.input} />
                            <input name="supervisor" value={formData.supervisor} onChange={handleFormChange} placeholder="Giáo viên hướng dẫn" style={styles.input} />
                        </div>
                        <textarea name="background" value={formData.background} onChange={handleFormChange} placeholder="Nhập bối cảnh nghiên cứu / Tính cấp thiết..." style={styles.textarea}></textarea>
                    </FormSection>

                    <FormSection title="2. Chọn Khung Lý thuyết">
                        <div style={styles.filterContainer}>
                            <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)} style={styles.select}>
                                <option value="all">-- Lọc theo Nhóm ngành --</option>
                                {filterOptions.groups.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <select value={selectedDomain} onChange={e => setSelectedDomain(e.target.value)} style={styles.select}>
                                <option value="all">-- Lọc theo Lĩnh vực --</option>
                                {filterOptions.domains.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                            <input type="search" placeholder="Tìm kiếm tên lý thuyết..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} style={styles.searchInput} />
                        </div>
                        <div style={styles.theoryList}>
                            {filteredTheories.length > 0 ? filteredTheories.map(t => (
                                <div key={t.id} style={styles.theoryItem}>
                                    <input type="checkbox" id={`theory-${t.id}`} checked={selectedTheoryIds.has(t.id)} onChange={() => handleTheorySelection(t.id)} />
                                    <label htmlFor={`theory-${t.id}`}>{t.theory}</label>
                                </div>
                            )) : <p>Không tìm thấy lý thuyết phù hợp.</p>}
                        </div>
                    </FormSection>
                    
                    <button onClick={handleSubmit} disabled={isLoading} style={styles.submitButton}>
                        {isLoading ? 'Đang xử lý...' : 'TẠO ĐỀ CƯƠNG'}
                    </button>
                    {status && <p style={{ fontStyle: 'italic', marginTop: '1rem', textAlign: 'center' }}>{status}</p>}
                </div>

                <div style={styles.rightColumn}>
                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 style={{...styles.sectionTitle, marginBottom: 0, border: 'none' }}>Kết quả Đề cương</h2>
                        {generatedProposal && (
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button onClick={handleCopy} style={styles.actionButton}>Sao chép</button>
                                <button onClick={handleExportPDF} style={styles.actionButton}>Xuất PDF</button>
                                <button onClick={handleExportWord} style={styles.actionButton}>Xuất Word</button>
                            </div>
                        )}
                    </div>
                    <div style={styles.resultBox}>
                        {generatedProposal ? (
                            <div ref={proposalContentRef} className="proposal-content" style={styles.proposalContent}>
                                <ReactMarkdown>{generatedProposal}</ReactMarkdown>
                            </div>
                        ) : (
                            <p style={{ color: '#666', textAlign: 'center', paddingTop: '2rem' }}>Kết quả sẽ được hiển thị ở đây sau khi bạn nhấn nút "Tạo Đề cương".</p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// --- OBJECT STYLE CHUYÊN NGHIỆP ---
const styles = {
    page: { fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", backgroundColor: '#f4f7f9', minHeight: '100vh' },
    header: { backgroundColor: '#ffffff', padding: '1.5rem 2rem', textAlign: 'center', borderBottom: '1px solid #e0e0e0' },
    main: { display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '2rem' },
    leftColumn: { flex: '1 1 500px', display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '400px' },
    rightColumn: { flex: '1 1 600px', position: 'sticky', top: '2rem', height: 'calc(100vh - 4rem)', minWidth: '500px' },
    section: { backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    sectionTitle: { marginTop: 0, borderBottom: '2px solid #007bff', paddingBottom: '0.5rem', marginBottom: '1rem', color: '#333', fontSize: '1.25rem' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' },
    input: { width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', fontSize: '0.95rem' },
    textarea: { width: '100%', minHeight: '100px', marginTop: '1rem', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', boxSizing: 'border-box', resize: 'vertical', fontSize: '0.95rem' },
    filterContainer: { display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' },
    select: { padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', flex: 1, minWidth: '150px' },
    searchInput: { padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', flex: 2, minWidth: '200px' },
    theoryList: { maxHeight: '250px', overflowY: 'auto', border: '1px solid #e0e0e0', padding: '0.5rem', borderRadius: '4px' },
    theoryItem: { padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' },
    submitButton: { width: '100%', padding: '1rem', fontSize: '1.1rem', cursor: 'pointer', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' },
    resultBox: { border: '1px solid #e0e0e0', backgroundColor: '#ffffff', padding: '1.5rem', height: 'calc(100% - 60px)', overflowY: 'auto', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
    proposalContent: { lineHeight: 1.6, color: '#333' },
    actionButton: { padding: '0.5rem 1rem', border: '1px solid #007bff', backgroundColor: 'transparent', color: '#007bff', borderRadius: '4px', cursor: 'pointer', fontSize: '0.9rem' }
};