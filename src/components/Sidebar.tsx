import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Animated,
  TextInput,
  Platform,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Enhanced menu structure with badges and roles
const menuItems = [
  { id: 'home', label: 'Home', icon: 'home', route: 'Home' },
  {
    id: 'employee',
    label: 'Employee Management',
    icon: 'users',
    badge: 5, // Badge for pending actions
    children: [
      { id: 'employee-profiles', label: 'Employee Profiles', icon: 'user', route: 'EmployeeProfiles' },
      { id: 'employee-directory', label: 'Employee Directory', icon: 'users', route: 'EmployeeDirectory' },
      { id: 'profile-management', label: 'Profile Management', icon: 'edit-3', route: 'ProfileManagement' },
      { id: 'onboarding', label: 'Onboarding', icon: 'user-plus', route: 'Onboarding', badge: 2 },
    ],
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: 'clock',
    children: [
      { id: 'daily-attendance', label: 'Daily Attendance', icon: 'calendar', route: 'DailyAttendance' },
      { id: 'monthly-calendar', label: 'Monthly Calendar', icon: 'calendar', route: 'MonthlyCalendar' },
      { id: 'attendance-reports', label: 'Attendance Reports', icon: 'bar-chart-2', route: 'AttendanceReports' },
    ],
  },
  {
    id: 'leave',
    label: 'Leave Management',
    icon: 'briefcase',
    badge: 8, // Pending approvals
    children: [
      { id: 'leave-requests', label: 'Leave Requests', icon: 'file-text', route: 'LeaveRequests', badge: 8 },
      { id: 'leave-calendar', label: 'Leave Calendar', icon: 'calendar', route: 'LeaveCalendar' },
      { id: 'leave-policies', label: 'Leave Policies', icon: 'book', route: 'LeavePolicies' },
    ],
  },
  {
    id: 'payroll',
    label: 'Payroll',
    icon: 'dollar-sign',
    children: [
      { id: 'salary-management', label: 'Salary Management', icon: 'credit-card', route: 'SalaryManagement' },
      { id: 'payslips', label: 'Payslips', icon: 'file', route: 'Payslips' },
      { id: 'tax-management', label: 'Tax Management', icon: 'percent', route: 'TaxManagement' },
    ],
  },
  {
    id: 'reports',
    label: 'Reports & Analytics',
    icon: 'trending-up',
    children: [
      { id: 'hr-dashboard', label: 'HR Dashboard', icon: 'pie-chart', route: 'HRDashboard' },
      { id: 'custom-reports', label: 'Custom Reports', icon: 'file-text', route: 'CustomReports' },
      { id: 'export-data', label: 'Export Data', icon: 'download', route: 'ExportData' },
    ],
  },
  { id: 'announcements', label: 'Announcements', icon: 'bell', route: 'Announcements', badge: 3 },
  { id: 'settings', label: 'Settings', icon: 'settings', route: 'Settings' },
];

const Sidebar = ({ navigation, isCollapsed, onToggle, onLogout, currentRoute = 'Home' }) => {
  const [expandedMenus, setExpandedMenus] = useState(['employee', 'attendance']);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Animated values for smooth transitions
  const [collapseAnim] = useState(new Animated.Value(isCollapsed ? 70 : 260));

  // Toggle menu expansion
  const toggleMenu = useCallback((id) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  }, []);

  // Handle sidebar collapse/expand animation
  React.useEffect(() => {
    Animated.spring(collapseAnim, {
      toValue: isCollapsed ? 70 : 260,
      useNativeDriver: false,
      tension: 50,
      friction: 8,
    }).start();
  }, [isCollapsed]);

  // Filter menu items based on search
  const filteredMenuItems = useMemo(() => {
    if (!searchQuery.trim()) return menuItems;
    
    const query = searchQuery.toLowerCase();
    return menuItems
      .map((item) => {
        if (item.label.toLowerCase().includes(query)) {
          return item;
        }
        if (item.children) {
          const filteredChildren = item.children.filter((child) =>
            child.label.toLowerCase().includes(query)
          );
          if (filteredChildren.length > 0) {
            return { ...item, children: filteredChildren };
          }
        }
        return null;
      })
      .filter(Boolean);
  }, [searchQuery]);

  // Check if route is active
  const isActiveRoute = useCallback((route) => {
    return currentRoute === route;
  }, [currentRoute]);

  // Render badge
  const renderBadge = (count) => {
    if (!count || isCollapsed) return null;
    return (
      <View style={styles.badge}>
        <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
      </View>
    );
  };

  // Render tooltip for collapsed state
  const renderTooltip = (label) => {
    if (!isCollapsed || hoveredItem !== label) return null;
    return (
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>{label}</Text>
      </View>
    );
  };

  // Navigate to route
  const navigateToRoute = (route) => {
    if (navigation && route) {
      navigation.navigate(route);
    }
  };

  return (
    <Animated.View style={[styles.sidebar, { width: collapseAnim }]}>
      {/* Header */}
      <View style={styles.header}>
        {!isCollapsed && (
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>MH</Text>
            </View>
            <Text style={styles.logoTitle}>HR Portal</Text>
          </View>
        )}
        <TouchableOpacity onPress={onToggle} style={styles.toggleButton}>
          <Icon 
            name={isCollapsed ? 'chevron-right' : 'chevron-left'} 
            size={20} 
            color="#666" 
          />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <TouchableOpacity 
        style={styles.profile} 
        onPress={() => navigateToRoute('Profile')}
        activeOpacity={0.7}
      >
        <View style={styles.avatarContainer}>
          <Icon name="user" size={isCollapsed ? 24 : 32} color="#4A90E2" />
          <View style={styles.statusIndicator} />
        </View>
        {!isCollapsed && (
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Asifa</Text>
            <Text style={styles.profileRole}>HR Manager</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Search Bar */}
      {!isCollapsed && (
        <View style={styles.searchContainer}>
          <Icon name="search" size={16} color="#999" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={16} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Menu */}
      <ScrollView 
        style={styles.menu} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
      >
        {filteredMenuItems.map((item) => (
          <View key={item.id}>
            <Pressable
              style={({ pressed }) => [
                styles.menuItem,
                isActiveRoute(item.route) && styles.menuItemActive,
                pressed && styles.menuItemPressed,
              ]}
              onPress={() => {
                if (item.children) {
                  if (!isCollapsed) {
                    toggleMenu(item.id);
                  }
                } else {
                  navigateToRoute(item.route);
                }
              }}
              onHoverIn={() => setHoveredItem(item.label)}
              onHoverOut={() => setHoveredItem(null)}
            >
              <View style={styles.menuItemContent}>
                <Icon 
                  name={item.icon} 
                  size={20} 
                  color={isActiveRoute(item.route) ? '#4A90E2' : '#666'} 
                />
                {!isCollapsed && (
                  <>
                    <Text 
                      style={[
                        styles.menuLabel,
                        isActiveRoute(item.route) && styles.menuLabelActive
                      ]}
                    >
                      {item.label}
                    </Text>
                    {renderBadge(item.badge)}
                  </>
                )}
                {item.children && !isCollapsed && (
                  <Icon
                    name={expandedMenus.includes(item.id) ? 'chevron-down' : 'chevron-right'}
                    size={16}
                    color="#999"
                    style={styles.chevronIcon}
                  />
                )}
              </View>
              {isCollapsed && item.badge && (
                <View style={styles.collapsedBadge} />
              )}
            </Pressable>
            {renderTooltip(item.label)}

            {/* Submenu */}
            {item.children && 
             expandedMenus.includes(item.id) && 
             !isCollapsed && (
              <View style={styles.subMenu}>
                {item.children.map((child) => (
                  <Pressable
                    key={child.id}
                    style={({ pressed }) => [
                      styles.subMenuItem,
                      isActiveRoute(child.route) && styles.subMenuItemActive,
                      pressed && styles.menuItemPressed,
                    ]}
                    onPress={() => navigateToRoute(child.route)}
                  >
                    <Icon 
                      name={child.icon} 
                      size={16} 
                      color={isActiveRoute(child.route) ? '#4A90E2' : '#999'} 
                    />
                    <Text 
                      style={[
                        styles.subMenuLabel,
                        isActiveRoute(child.route) && styles.menuLabelActive
                      ]}
                    >
                      {child.label}
                    </Text>
                    {renderBadge(child.badge)}
                  </Pressable>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottom}>
        <View style={styles.divider} />
        
        {/* Help Center */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => navigateToRoute('HelpCenter')}
        >
          <Icon name="help-circle" size={20} color="#666" />
          {!isCollapsed && <Text style={styles.menuLabel}>Help Center</Text>}
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity 
          style={styles.menuItem} 
          onPress={() => setShowLogoutConfirm(true)}
        >
          <Icon name="log-out" size={20} color="#E74C3C" />
          {!isCollapsed && <Text style={[styles.menuLabel, styles.logoutText]}>Logout</Text>}
        </TouchableOpacity>

        {/* Version */}
        {!isCollapsed && (
          <Text style={styles.versionText}>v2.1.0</Text>
        )}
      </View>

      {/* Logout Confirmation Modal */}
      <Modal 
        visible={showLogoutConfirm} 
        transparent 
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setShowLogoutConfirm(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Icon name="log-out" size={32} color="#E74C3C" />
              </View>
              <Text style={styles.modalTitle}>Confirm Logout</Text>
              <Text style={styles.modalMessage}>
                Are you sure you want to logout from your account?
              </Text>
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                onPress={() => setShowLogoutConfirm(false)} 
                style={[styles.modalButton, styles.cancelButton]}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowLogoutConfirm(false);
                  onLogout?.();
                }}
                style={[styles.modalButton, styles.logoutButton]}
              >
                <Text style={styles.logoutButtonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#E0E0E0',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4A90E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  logoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  toggleButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: '#F5F5F5',
  },
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  avatarContainer: {
    position: 'relative',
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#27AE60',
    borderWidth: 2,
    borderColor: '#fff',
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    padding: 0,
  },
  menu: {
    flex: 1,
  },
  menuContent: {
    paddingBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
    position: 'relative',
  },
  menuItemActive: {
    backgroundColor: '#E3F2FD',
    borderLeftWidth: 3,
    borderLeftColor: '#4A90E2',
  },
  menuItemPressed: {
    backgroundColor: '#F5F5F5',
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuLabel: {
    marginLeft: 16,
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
  menuLabelActive: {
    color: '#4A90E2',
    fontWeight: '600',
  },
  chevronIcon: {
    marginLeft: 'auto',
  },
  badge: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  collapsedBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E74C3C',
    position: 'absolute',
    top: 8,
    right: 8,
  },
  tooltip: {
    position: 'absolute',
    left: 70,
    backgroundColor: '#333',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
  },
  subMenu: {
    paddingLeft: 24,
    marginTop: 4,
  },
  subMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 8,
    marginVertical: 2,
    borderRadius: 8,
  },
  subMenuItemActive: {
    backgroundColor: '#F0F8FF',
  },
  subMenuLabel: {
    marginLeft: 12,
    fontSize: 14,
    color: '#666',
    fontWeight: '400',
    flex: 1,
  },
  bottom: {
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    paddingTop: 12,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginBottom: 8,
  },
  logoutText: {
    color: '#E74C3C',
    fontWeight: '600',
  },
  versionText: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F5F5F5',
  },
  cancelButtonText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    backgroundColor: '#E74C3C',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Sidebar;
