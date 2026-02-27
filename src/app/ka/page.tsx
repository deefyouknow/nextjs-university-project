"use client";

import React, { useState, useEffect } from 'react';

// Define interfaces for the fetched election data
interface ProvinceData {
  province_id: string;
  prov_id: string;
  province: string;
  abbre_thai: string;
  eng: string;
  total_vote_stations: number;
  total_registered_vote: number;
}

interface ElectionInfo {
  latestResultsLink: string;
  upcomingElectionsLink: string;
  voterInformationLink: string;
  contactInfo: {
    address: string;
    phone: string;
    email: string;
  };
  mapLink: string;
  provinceData?: ProvinceData[];
}

const Dekn = () => {
  const [electionInfo, setElectionInfo] = useState<ElectionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      // Mock data for general election information
      const mockGeneralData: ElectionInfo = {
        latestResultsLink: "https://www.ect.go.th/ect_th/th/election-results",
        upcomingElectionsLink: "https://www.ect.go.th/ect_th/th/upcoming-elections",
        voterInformationLink: "https://www.ect.go.th/ect_th/th/voter-information",
        contactInfo: {
          address: "120 หมู่ 3 ถนนงามวงศ์วาน ตำบลบางเขน อำเภอเมืองนนทบุรี จังหวัดนนทบุรี 11000",
          phone: "0-2141-8170",
          email: "info@ect.go.th",
        },
        mapLink: "https://www.ect.go.th/th/election-map",
      };

      // Fetch province-specific data
      const provinceResponse = await fetch("https://static-ectreport69.ect.go.th/data/data/refs/info_province.json");
      if (!provinceResponse.ok) {
        throw new Error(`HTTP error! status: ${provinceResponse.status}`);
      }
      const provinceData: ProvinceData[] = await provinceResponse.json();

      setElectionInfo({
        ...mockGeneralData,
        provinceData: provinceData
      });
      setLoading(false);
    } catch (err) {
      setError("ไม่สามารถดึงข้อมูลได้ในขณะนี้");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-gray-700">กำลังโหลดข้อมูล...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-lg text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 md:p-8 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center text-gray-800">หน้าหลัก คณะกรรมการการเลือกตั้ง (กกต.)</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Election Results Card */}
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-3 text-blue-700">ผลการเลือกตั้ง</h2>
            <p className="text-gray-700 mb-4 grow">
              ตรวจสอบผลการนับคะแนนการเลือกตั้งล่าสุดอย่างละเอียด.
            </p>
            <a
              href={electionInfo?.latestResultsLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300 inline-block w-full text-lg font-medium"
            >
              ดูผลการเลือกตั้ง
            </a>
          </div>

          {/* Voter Information Card */}
          <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-3 text-green-700">ข้อมูลผู้มีสิทธิ์เลือกตั้ง</h2>
            <p className="text-gray-700 mb-4 grow">
              ค้นหาข้อมูลหน่วยเลือกตั้ง, รายชื่อผู้มีสิทธิ์ และขั้นตอนการเลือกตั้ง.
            </p>
            <a
              href={electionInfo?.voterInformationLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-3 bg-green-500 text-white rounded-full hover:bg-green-600 transition duration-300 inline-block w-full text-lg font-medium"
            >
              ข้อมูลผู้มีสิทธิ์
            </a>
          </div>

          {/* Upcoming Elections Card */}
          <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
            <h2 className="text-xl font-semibold mb-3 text-yellow-700">การเลือกตั้งที่กำลังจะมาถึง</h2>
            <p className="text-gray-700 mb-4 grow">
              ติดตามข่าวสารและกำหนดการเกี่ยวกับการเลือกตั้งครั้งต่อไป.
            </p>
            <a
              href={electionInfo?.upcomingElectionsLink || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-3 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-300 inline-block w-full text-lg font-medium"
            >
              ดูการเลือกตั้ง
            </a>
          </div>
        </div>

        {/* Province Data Section */}
        <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl mb-8">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">ข้อมูลการเลือกตั้งรายจังหวัด</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จังหวัด</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">หน่วยเลือกตั้ง</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ผู้มีสิทธิ์เลือกตั้ง</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {electionInfo?.provinceData?.map((province) => (
                  <tr key={province.province_id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{province.province}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{province.total_vote_stations.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{province.total_registered_vote.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Map Section */}
          <div>
            <h2 className="text-3xl font-bold mb-5 text-center text-gray-800">แผนที่สำนักงาน กกต.</h2>
            <div className="border rounded-lg shadow-lg overflow-hidden bg-gray-200">
              <iframe
                src={electionInfo?.mapLink || "https://www.ect.go.th/th/election-map"}
                title="แผนที่สำนักงาน กกต."
                className="w-full h-72 md:h-96 lg:h-96 object-cover"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-gray-50 border border-gray-200 p-6 md:p-8 rounded-lg shadow-md text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-5 text-center text-gray-800">ติดต่อ กกต.</h2>
            <p className="text-lg text-gray-700 mb-3 flex items-center justify-center lg:justify-start">
              <span className="font-semibold mr-2">ที่อยู่:</span>
              {electionInfo?.contactInfo?.address || "กำลังโหลด..."}
            </p>
            <p className="text-lg text-gray-700 mb-3 flex items-center justify-center lg:justify-start">
              <span className="font-semibold mr-2">โทรศัพท์:</span>
              {electionInfo?.contactInfo?.phone || "กำลังโหลด..."}
            </p>
            <p className="text-lg text-gray-700 mb-3 flex items-center justify-center lg:justify-start">
              <span className="font-semibold mr-2">อีเมล:</span>
              {electionInfo?.contactInfo?.email || "กำลังโหลด..."}
            </p>
            <div className="mt-6 flex justify-center lg:justify-start">
              <a
                href="https://www.ect.go.th/th/contact-us"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gray-500 text-white rounded-full hover:bg-gray-600 transition duration-300 text-lg font-medium"
              >
                ดูช่องทางการติดต่ออื่น ๆ
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dekn;
