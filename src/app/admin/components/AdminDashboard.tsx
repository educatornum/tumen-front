"use client";
import React, { useState } from 'react';
import {
  AlertCircle,
  FileText,
  LayoutDashboard,
  Bell,
  Menu,
  ChevronRight,
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    {
      id: 'winners',
      label: 'Нийт сугалаа авсан харилцагчид',
      icon: Ticket,
      description: 'Сугалаанд оролцох эрхтэй хэрэглэгчид'
    },
       {
      id: 'WinnersPlus100Tab',
      label: '100-аас дээш харилцагчид',
      icon: Ticket,
      description: 'Сугалаанд оролцох эрхтэй хэрэглэгчид'
    },
    {
      id: 'failed',
      label: 'Сугалаа олгож чадаагүй-шууд данс',
      icon: AlertCircle,
      description: 'Алдаа гарсан болон цуцлагдсан'
    },
    {
      id: 'transactions',
      label: 'Нийт гүйлгээний тайлан',
      icon: FileText,
      description: 'Санхүүгийн нэгдсэн мэдээлэл'
    },
     {
      id: 'Qpayfailed',
      label: 'Сугалаа олгож чадаагүй-QPAY',
      icon: FileText,
      description: 'Алдаа гарсан болон цуцлагдсан'
    },
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
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">

      {/* 1. SIDEBAR NAVIGATION */}
      <aside
        className={`${
          isSidebarOpen ? 'w-72' : 'w-20'
        } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col fixed md:relative h-full z-20 shadow-xl`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
          {isSidebarOpen ? (
            <div className="flex items-center gap-2">
              <img src="images/logo/tumen-logo.png"
                     alt="logo"
                    width={80}
                    height={45}
                    />
              <span className="font-bold text-lg tracking-wide">Түмэн сугалаа</span>
            </div>
          ) : (
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30">
                <LayoutDashboard className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative
                  ${isActive
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }
                `}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />

                {isSidebarOpen && (
                  <div className="text-left animate-fadeIn">
                    <p className={`text-sm font-medium ${isActive ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>
                      {item.label}
                    </p>
                  </div>
                )}

                {!isSidebarOpen && isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center'}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shadow-md border-2 border-slate-800">
              AD
            </div>
            {isSidebarOpen && (
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-white truncate">Admin User</p>
                <p className="text-xs text-slate-500 truncate"></p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">

        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors"
            >
              {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-slate-100 rounded-full text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
