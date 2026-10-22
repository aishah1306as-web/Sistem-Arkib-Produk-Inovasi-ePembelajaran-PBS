import React, { useState } from 'react';
import {
  Menu,
  Bell,
  UserCheck,
  Sparkles,
  Trash2,
  Check,
  ChevronDown,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { dbService } from '../../services/storage/databaseService';
import { seedSyntheticData, clearSyntheticData, isSyntheticRecord } from '../../services/seed/seedService';
import { BackendStatusBadge } from '../common/BackendStatusBadge';
import { UserRoleBadge } from '../common/Badge';
import { formatRelativeTimeMs } from '../../utils/dateFormatter';

interface TopNavbarProps {
  onOpenMobile: () => void;
  collapsed: boolean;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onOpenMobile, collapsed }) => {
  const { user, switchUserRoleForTesting } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const navigate = useNavigate();

  const allTestUsers = dbService.getUsers();

  const handleSeed = () => {
    seedSyntheticData();
    window.location.reload();
  };

  const handleClearSeed = () => {
    if (window.confirm('Adakah anda pasti ingin mengosongkan semua data ujian sintetik? Rekod rasmi tidak akan terjejas.')) {
      clearSyntheticData();
      window.location.reload();
    }
  };

  const hasSynthetic = dbService.getProducts().some(p => isSyntheticRecord(p.title));

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200/80 px-4 sm:px-6 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & System Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobile}
          className="lg:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-bold text-navy-900 leading-tight">
            Sistem Arkib Produk Inovasi ePembelajaran
          </h2>
          <p className="text-[11px] text-gray-500 font-medium">
            Politeknik Banting Selangor (SAPIe)
          </p>
        </div>
      </div>

      {/* Right: Actions, Role Switcher, Notifications, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Backend Status */}
        <div className="hidden md:block">
          <BackendStatusBadge />
        </div>

        {/* Demo Seed Controls */}
        <div className="flex items-center gap-1.5">
          {!hasSynthetic ? (
            <button
              onClick={handleSeed}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100 transition-colors"
              title="Isi data sampel sintetik untuk ujian peranan dan analitik"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden md:inline">Data Sintetik Ujian</span>
            </button>
          ) : (
            <button
              onClick={handleClearSeed}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition-colors"
              title="Kosongkan data ujian sintetik"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden md:inline">Kosongkan Ujian</span>
            </button>
          )}
        </div>

        {/* Quick Role Switcher for Testing */}
        <div className="relative">
          <button
            onClick={() => {
              setShowRoleMenu(!showRoleMenu);
              setShowNotifMenu(false);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-navy-50 text-navy-800 border border-navy-200 hover:bg-navy-100 transition-colors"
            title="Tukar Peranan Pengguna untuk Menguji Akses RBAC"
          >
            <UserCheck className="w-3.5 h-3.5 text-navy-600" />
            <span className="hidden sm:inline font-semibold">Tukar Peranan</span>
            <ChevronDown className="w-3 h-3 text-navy-600" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50">
              <div className="px-3.5 py-2 border-b border-gray-100">
                <p className="text-xs font-bold text-gray-900">Ujian Akses Peranan (RBAC)</p>
                <p className="text-[11px] text-gray-500">Pilih identiti untuk simulasi kebenaran pengguna:</p>
              </div>

              <div className="max-h-60 overflow-y-auto p-1">
                {allTestUsers.map((u) => {
                  const isCurrent = user?.uid === u.uid;
                  return (
                    <button
                      key={u.uid}
                      onClick={() => {
                        switchUserRoleForTesting(u.uid);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs flex items-center justify-between transition-colors ${
                        isCurrent ? 'bg-navy-50 text-navy-900 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className="font-medium text-gray-900">{u.fullName}</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <UserRoleBadge role={u.role} />
                          {u.departmentId && u.departmentId !== 'SEMUA' && (
                            <span className="text-[10px] text-gray-500">({u.departmentId})</span>
                          )}
                        </div>
                      </div>
                      {isCurrent && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              setShowRoleMenu(false);
            }}
            className="relative p-2 rounded-lg text-gray-600 hover:text-navy-800 hover:bg-gray-100 transition-colors focus:outline-none"
            title="Pemberitahuan Sistem"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 overflow-hidden">
              <div className="px-4 py-3 bg-navy-800 text-white flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Pusat Pemberitahuan</h4>
                  <p className="text-[11px] text-navy-200">{unreadCount} belum dibaca</p>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-[11px] text-navy-200 hover:text-white underline"
                  >
                    Tanda Semua Dibaca
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-gray-500">
                    Tiada pemberitahuan baharu.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.notificationId}
                      onClick={() => {
                        markAsRead(n.notificationId);
                        if (n.destinationRoute) {
                          navigate(n.destinationRoute);
                          setShowNotifMenu(false);
                        }
                      }}
                      className={`p-3 text-xs cursor-pointer transition-colors ${
                        !n.read ? 'bg-blue-50/60 hover:bg-blue-50 font-medium' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-gray-900">{n.title}</h5>
                        <span className="text-[10px] text-gray-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTimeMs(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-gray-600 mt-1 line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
