import dynamic from 'next/dynamic';
import Head from 'next/head';

// Sử dụng dynamic import với tùy chọn ssr: false
// Điều này ra lệnh cho Next.js KHÔNG render component này ở phía server.
// Component sẽ chỉ được tải và render ở trình duyệt của người dùng (client-side).
const ProposalGenerator = dynamic(
  () => import('../features/proposal/components/ProposalGenerator'),
  { 
    ssr: false,
    // Hiển thị một thông báo "Đang tải..." trong khi component đang được tải về
    loading: () => <p style={{ textAlign: 'center', paddingTop: '2rem' }}>Đang tải trình tạo đề cương...</p> 
  }
);

export default function ProposalGeneratorPage() {
  return (
    <>
      <Head>
        <title>Trình tạo Đề cương Nghiên cứu</title>
        <meta name="description" content="Công cụ hỗ trợ xây dựng đề cương nghiên cứu khoa học." />
      </Head>
      <ProposalGenerator />
    </>
  );
}