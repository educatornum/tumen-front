"use client";
import React, { useState } from 'react';
import {
  AlertCircle,
  FileText,
  Bell,
  Menu,
  Ticket,
} from 'lucide-react';
import WinnersTab from './WinnersTab';
import FailedLotteryTab from './FailedLotteryTab';
import TransactionsTab from './TransactionsTab';
import QpayInvoiceTab from './QpayInvoiceTab';
import WinnersPlus100Tab from './WinnersPlus100Tab';

// Types definition
type TabType = 'winners' | 'failed' | 'transactions' | 'WinnersPlus100Tab' | 'Qpayfailed';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('winners');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    {
      id: 'winners',
      label: 'Нийт сугалаа авсан харилцагчид',
      icon: Ticket,
      description: 'Сугалаанд оролцох эрхтэй хэрэглэгчид'
    },
 
    {
      id: 'failed',
      label: 'Алдаатай гүйлгээ',
      icon: AlertCircle,
      description: 'Алдаа гарсан болон цуцлагдсан'
    },
          {
      id: 'WinnersPlus100Tab',
      label: '100-аас дээш харилцагчид',
      icon: Ticket,
      description: 'Сугалаанд оролцох эрхтэй хэрэглэгчид'
    },
    {
      id: 'transactions',
      label: 'Нийт гүйлгээний тайлан',
      icon: FileText,
      description: 'Санхүүгийн нэгдсэн мэдээлэл'
    },
    //  {
    //   id: 'Qpayfailed',
    //   label: 'Сугалаа олгож чадаагүй-QPAY',
    //   icon: FileText,
    //   description: 'Алдаа гарсан болон цуцлагдсан'
    // },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'winners':
        return <WinnersTab />;
      case 'WinnersPlus100Tab':
        return <WinnersPlus100Tab />;
      case 'failed':
        return <FailedLotteryTab />;
      case 'Qpayfailed':
        return <QpayInvoiceTab/>
      case 'transactions':
        return <TransactionsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-slate-50 font-sans text-slate-900">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 1. SIDEBAR NAVIGATION */}
      <aside
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 w-72 md:w-72 bg-slate-900 text-white transition-transform duration-300 ease-in-out flex flex-col fixed md:relative h-full z-20 shadow-xl`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <img src="/images/logo/tumen-logo.png"
                   alt="logo"
                  width={80}
                  height={45}
                  />
            <span className="font-bold text-lg tracking-wide">Түмэн сугалаа</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as TabType);
                  // Close sidebar on mobile after selection
                  if (window.innerWidth < 768) {
                    setIsSidebarOpen(false);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />

                <div className="text-left animate-fadeIn">
                  <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                    {item.label}
                  </p>
                </div>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-slate-800">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Admin User</p>
              <p className="text-xs text-slate-500 truncate"></p>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm md:text-base font-semibold text-slate-800 truncate">
              {menuItems.find(item => item.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-3 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
