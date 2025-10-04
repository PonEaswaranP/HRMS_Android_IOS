
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Modal, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

// Example menu structure with nested submenus
const menuItems = [
  { id: 'home', label: 'Home', icon: 'home', route: 'Home' },
  {
    id: 'employee',
    label: 'Employee Management',
    icon: 'users',
    children: [
      { id: 'employee-profiles', label: 'Employee Profiles', icon: 'user', route: 'EmployeeProfiles' },
      { id: 'employee-directory', label: 'Employee Directory', icon: 'users', route: 'EmployeeDirectory' },
      { id: 'profile-management', label: 'Profile Management', icon: 'user', route: 'ProfileManagement' },
    ]
  },
  {
    id: 'attendance',
    label: 'Attendance',
    icon: 'clock',
    children: [
      { id: 'daily-attendance', label: 'Daily Attendance', icon: 'calendar', route: 'DailyAttendance' },
      { id: 'monthly-calendar', label: 'Monthly Calendar', icon: 'calendar', route: 'MonthlyCalendar' },
    ]
  },
  { id: 'settings', label: 'Settings', icon: 'settings', route: 'Settings' },
];

const Sidebar = ({ navigation, isCollapsed, onToggle, onLogout }) => {
  const [expandedMenus, setExpandedMenus] = React.useState([]);
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false);

  const toggleMenu = (id) => {
    setExpandedMenus((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  return (
    <Animated.View style={[styles.sidebar, isCollapsed && styles.collapsed]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MH-HR</Text>
        <TouchableOpacity onPress={onToggle}>
          <Icon name={isCollapsed ? 'chevron-right' : 'chevron-left'} size={24} />
        </TouchableOpacity>
      </View>

      {/* Profile */}
      <TouchableOpacity style={styles.profile} onPress={() => navigation.navigate('Profile')}>
        <Icon name="user" size={32} />
        {!isCollapsed && (
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.profileName}>HR</Text>
            <Text style={styles.profileRole}>Profile</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Menu */}
      <ScrollView style={styles.menu}>
        {menuItems.map((item) => (
          <View key={item.id}>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => item.children ? toggleMenu(item.id) : navigation.navigate(item.route)}
            >
              <Icon name={item.icon} size={20} />
              {!isCollapsed && <Text style={styles.menuLabel}>{item.label}</Text>}
              {item.children && !isCollapsed && (
                <Icon
                  name={expandedMenus.includes(item.id) ? 'chevron-down' : 'chevron-right'}
                  size={16}
                  style={{ marginLeft: 'auto' }}
                />
              )}
            </TouchableOpacity>
            {/* Submenu */}
            {item.children && expandedMenus.includes(item.id) && !isCollapsed && (
              <View style={styles.subMenu}>
                {item.children.map((child) => (
                  <TouchableOpacity
                    key={child.id}
                    style={styles.subMenuItem}
                    onPress={() => navigation.navigate(child.route)}
                  >
                    <Icon name={child.icon} size={16} />
                    <Text style={styles.menuLabel}>{child.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottom}>
        <TouchableOpacity style={styles.menuItem} onPress={() => setShowLogoutConfirm(true)}>
          <Icon name="log-out" size={20} color="red" />
          {!isCollapsed && <Text style={[styles.menuLabel, { color: 'red' }]}>Logout</Text>}
        </TouchableOpacity>
      </View>

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text>Are you sure you want to logout?</Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity onPress={() => setShowLogoutConfirm(false)} style={styles.modalButton}>
                <Text>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
                style={[styles.modalButton, { backgroundColor: 'red' }]}
              >
                <Text style={{ color: 'white' }}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    width: 260,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#eee',
    paddingTop: 40,
    flex: 1,
  },
  collapsed: { width: 70 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 20 },
  logo: { fontWeight: 'bold', fontSize: 20 },
  profile: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  profileName: { fontWeight: 'bold' },
  profileRole: { fontSize: 12, color: '#888' },
  menu: { flex: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  menuLabel: { marginLeft: 16, fontSize: 16 },
  subMenu: { paddingLeft: 32 },
  subMenuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  bottom: { borderTopWidth: 1, borderColor: '#eee', padding: 16 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', padding: 24, borderRadius: 8, alignItems: 'center' },
  modalButton: { marginHorizontal: 10, padding: 10, borderRadius: 5, backgroundColor: '#eee' },
});

export default Sidebar;