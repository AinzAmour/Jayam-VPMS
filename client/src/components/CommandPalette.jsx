import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CommandPaletteComponent, { filterItems, getItemIndex } from 'react-cmdk';
import 'react-cmdk/dist/cmdk.css';
import { useAuth } from '../context/AuthContext';
import { getNavItemsForRole, getQuickActionsForRole } from '../config/navigation';

/**
 * Enterprise Command Palette (Ctrl+K / Cmd+K)
 * Powered by react-cmdk with Jayam VPMS design system styling.
 * Role-scoped navigation and quick actions with fast keyboard interaction.
 */
export const CommandPalette = ({ isOpen, setIsOpen }) => {
  const [search, setSearch] = useState('');
  const { role } = useAuth();
  const navigate = useNavigate();

  // Global keyboard listener for Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  // Reset search query when closed
  useEffect(() => {
    if (!isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const navItems = getNavItemsForRole(role);
  const quickActions = getQuickActionsForRole(role);

  const handleSelect = (to) => {
    if (!to) return;
    setIsOpen(false);
    setSearch('');
    navigate(to);
  };

  // Build JSON structure for react-cmdk filtering
  const commandStructure = [
    {
      id: 'navigation',
      heading: 'Navigation',
      items: navItems.map((item) => ({
        id: `nav-${item.to}`,
        children: item.label,
        icon: item.cmdkIcon || 'ArrowRightIcon',
        onClick: () => handleSelect(item.to),
        keywords: item.keywords || [],
      })),
    },
    {
      id: 'quick-actions',
      heading: 'Quick Actions',
      items: quickActions.map((action) => ({
        id: action.id,
        children: action.label,
        icon: action.cmdkIcon || 'SparklesIcon',
        onClick: () => handleSelect(action.to),
        keywords: action.keywords || [],
      })),
    },
  ].filter((group) => group.items.length > 0);

  const filteredItems = filterItems(commandStructure, search);

  return (
    <div className="jayam-command-palette-wrapper">
      <CommandPaletteComponent
        page="root"
        onChangeSearch={setSearch}
        onChangeOpen={setIsOpen}
        isOpen={isOpen}
        search={search}
        placeholder="Type a command or jump to page..."
        footer={
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium px-4 py-2 bg-slate-50 border-t border-slate-100 select-none">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded shadow-2xs text-slate-600">
                  ↑
                </kbd>
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded shadow-2xs text-slate-600">
                  ↓
                </kbd>
                <span className="ml-1">Navigate</span>
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded shadow-2xs text-slate-600">
                  ↵
                </kbd>
                <span className="ml-1">Select</span>
              </span>
            </div>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded shadow-2xs text-slate-600">
                esc
              </kbd>
              <span className="ml-1">Close</span>
            </span>
          </div>
        }
      >
        <CommandPaletteComponent.Page id="root">
          {filteredItems.length ? (
            filteredItems.map((list) => (
              <CommandPaletteComponent.List key={list.id} heading={list.heading}>
                {list.items.map(({ id, ...rest }) => (
                  <CommandPaletteComponent.ListItem
                    key={id}
                    index={getItemIndex(filteredItems, id)}
                    {...rest}
                  />
                ))}
              </CommandPaletteComponent.List>
            ))
          ) : (
            <div className="py-10 text-center text-xs text-slate-400">
              No matching commands or pages found.
            </div>
          )}
        </CommandPaletteComponent.Page>
      </CommandPaletteComponent>
    </div>
  );
};

export default CommandPalette;
