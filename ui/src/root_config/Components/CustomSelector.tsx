import React from "react";
import "../styles.scss";
import Table from "./Table";

interface TypeCustomComponent {
  config: any;
  setError: (errObj: any) => void;
  successFn: (assets: any[]) => void;
  closeFn: () => void;
  selectedAssetIds: string[];
}

const CustomSelector: React.FC<TypeCustomComponent> = function (
  {
    config,
    setError,
    successFn,
    closeFn,
    selectedAssetIds,
  }: TypeCustomComponent) {

  console.log('!!!🚀 config:', config); // eslint-disable-line no-console

  // Mock asset data - developers should replace this with their actual data fetching
  const mockAssetData = [
    {
      _id: "1",
      assetName: "hero-banner-desktop.jpg",
      assetUrl: "https://picsum.photos/1920/1080?random=1",
      thumbnail: "https://picsum.photos/150/150?random=1",
      fileSize: "3.2 MB",
      fileType: "JPEG",
      dimensions: { width: 1920, height: 1080 },
      createdDate: "2024-01-15",
    },
    {
      _id: "2",
      assetName: "product-catalog.pdf",
      assetUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      thumbnail: "https://via.placeholder.com/150x150/ff6b6b/ffffff?text=PDF",
      fileSize: "1.8 MB",
      fileType: "PDF",
      dimensions: null,
      createdDate: "2024-01-14",
    },
    {
      _id: "3",
      assetName: "company-logo.svg",
      assetUrl: "https://via.placeholder.com/300x100/4ecdc4/ffffff?text=LOGO",
      thumbnail: "https://via.placeholder.com/150x50/4ecdc4/ffffff?text=LOGO",
      fileSize: "45 KB",
      fileType: "SVG",
      dimensions: { width: 300, height: 100 },
      createdDate: "2024-01-13",
    },
    {
      _id: "4",
      assetName: "team-photo-group.png",
      assetUrl: "https://picsum.photos/1200/800?random=4",
      thumbnail: "https://picsum.photos/150/150?random=4",
      fileSize: "4.1 MB",
      fileType: "PNG",
      dimensions: { width: 1200, height: 800 },
      createdDate: "2024-01-12",
    },
    {
      _id: "5",
      assetName: "presentation-slides.pptx",
      assetUrl: "https://via.placeholder.com/150x150/ff9ff3/ffffff?text=PPTX",
      thumbnail: "https://via.placeholder.com/150x150/ff9ff3/ffffff?text=PPTX",
      fileSize: "2.7 MB",
      fileType: "PPTX",
      dimensions: null,
      createdDate: "2024-01-11",
    },
    {
      _id: "6",
      assetName: "mobile-app-icon.png",
      assetUrl: "https://picsum.photos/512/512?random=6",
      thumbnail: "https://picsum.photos/150/150?random=6",
      fileSize: "156 KB",
      fileType: "PNG",
      dimensions: { width: 512, height: 512 },
      createdDate: "2024-01-10",
    },
    {
      _id: "7",
      assetName: "video-demo.mp4",
      assetUrl: "https://via.placeholder.com/150x150/54a0ff/ffffff?text=MP4",
      thumbnail: "https://via.placeholder.com/150x150/54a0ff/ffffff?text=MP4",
      fileSize: "15.3 MB",
      fileType: "MP4",
      dimensions: { width: 1920, height: 1080 },
      createdDate: "2024-01-09",
    },
    {
      _id: "8",
      assetName: "infographic-chart.png",
      assetUrl: "https://picsum.photos/800/600?random=8",
      thumbnail: "https://picsum.photos/150/150?random=8",
      fileSize: "892 KB",
      fileType: "PNG",
      dimensions: { width: 800, height: 600 },
      createdDate: "2024-01-08",
    },
    {
      _id: "9",
      assetName: "brand-guidelines.pdf",
      assetUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      thumbnail: "https://via.placeholder.com/150x150/5f27cd/ffffff?text=PDF",
      fileSize: "3.4 MB",
      fileType: "PDF",
      dimensions: null,
      createdDate: "2024-01-07",
    },
    {
      _id: "10",
      assetName: "social-media-post.jpg",
      assetUrl: "https://picsum.photos/1080/1080?random=10",
      thumbnail: "https://picsum.photos/150/150?random=10",
      fileSize: "1.2 MB",
      fileType: "JPEG",
      dimensions: { width: 1080, height: 1080 },
      createdDate: "2024-01-06",
    },
    {
      _id: "11",
      assetName: "website-banner.jpg",
      assetUrl: "https://picsum.photos/1200/400?random=11",
      thumbnail: "https://picsum.photos/150/150?random=11",
      fileSize: "2.1 MB",
      fileType: "JPEG",
      dimensions: { width: 1200, height: 400 },
      createdDate: "2024-01-05",
    },
    {
      _id: "12",
      assetName: "email-template.html",
      assetUrl: "https://via.placeholder.com/150x150/ff6b6b/ffffff?text=HTML",
      thumbnail: "https://via.placeholder.com/150x150/ff6b6b/ffffff?text=HTML",
      fileSize: "15 KB",
      fileType: "HTML",
      dimensions: null,
      createdDate: "2024-01-04",
    },
    {
      _id: "13",
      assetName: "product-photo.jpg",
      assetUrl: "https://picsum.photos/800/600?random=13",
      thumbnail: "https://picsum.photos/150/150?random=13",
      fileSize: "1.8 MB",
      fileType: "JPEG",
      dimensions: { width: 800, height: 600 },
      createdDate: "2024-01-03",
    },
    {
      _id: "14",
      assetName: "user-manual.pdf",
      assetUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      thumbnail: "https://via.placeholder.com/150x150/5f27cd/ffffff?text=PDF",
      fileSize: "4.2 MB",
      fileType: "PDF",
      dimensions: null,
      createdDate: "2024-01-02",
    },
    {
      _id: "15",
      assetName: "app-screenshot.png",
      assetUrl: "https://picsum.photos/400/800?random=15",
      thumbnail: "https://picsum.photos/150/150?random=15",
      fileSize: "890 KB",
      fileType: "PNG",
      dimensions: { width: 400, height: 800 },
      createdDate: "2024-01-01",
    },
  ];


  return (
      <Table
        setError={setError}
        successFn={successFn}
        closeFn={closeFn}
        selectedAssetIds={selectedAssetIds}
        assetData={mockAssetData}
      />
  );
};

export default CustomSelector;
