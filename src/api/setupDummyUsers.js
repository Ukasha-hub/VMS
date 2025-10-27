const setupDummyUsers = () => {
  if (!localStorage.getItem("users")) {
    const dummyUsers = [
      // Admins
      {
        id: 1,
        category: "admin",
        name: "Ayesha Rahman",
        email: "ayesha.admin@kazifarms.com",
        password: "admin123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Admin Division",
        phoneNumber: "01710000001",
        photo: "https://randomuser.me/api/portraits/women/1.jpg",
      },
      {
        id: 2,
        category: "admin",
        name: "Hasibul Karim",
        email: "hasibul.admin@kazifarms.com",
        password: "admin123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Admin Division",
        phoneNumber: "01710000002",
        photo: "https://randomuser.me/api/portraits/men/2.jpg",
      },

      // Employees
      {
        id: 3,
        category: "employee",
        name: "Tania Akter",
        email: "tania.emp@kazifarms.com",
        password: "emp123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "HR Department",
        phoneNumber: "01710000003",
        photo: "https://randomuser.me/api/portraits/women/3.jpg",
      },
      {
        id: 4,
        category: "employee",
        name: "Shahriar Hossain",
        email: "shahriar.emp@kazifarms.com",
        password: "emp123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "IT Department",
        phoneNumber: "01710000004",
        photo: "https://randomuser.me/api/portraits/men/4.jpg",
      },
      {
        id: 5,
        category: "employee",
        name: "Nusrat Jahan",
        email: "nusrat.emp@kazifarms.com",
        password: "emp123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Finance Department",
        phoneNumber: "01710000005",
        photo: "https://randomuser.me/api/portraits/women/5.jpg",
      },
      {
        id: 6,
        category: "employee",
        name: "Sabbir Ahmed",
        email: "sabbir.emp@kazifarms.com",
        password: "emp123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Marketing Department",
        phoneNumber: "01710000006",
        photo: "https://randomuser.me/api/portraits/men/6.jpg",
      },

      // Security Guards
      {
        id: 7,
        category: "security",
        name: "Mizanur Rahman",
        email: "mizan.guard@kazifarms.com",
        password: "guard123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Security Unit",
        phoneNumber: "01710000007",
        photo: "https://randomuser.me/api/portraits/men/7.jpg",
      },
      {
        id: 8,
        category: "security",
        name: "Faruk Hossain",
        email: "faruk.guard@kazifarms.com",
        password: "guard123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Security Unit",
        phoneNumber: "01710000008",
        photo: "https://randomuser.me/api/portraits/men/8.jpg",
      },
      {
        id: 9,
        category: "security",
        name: "Salma Khatun",
        email: "salma.guard@kazifarms.com",
        password: "guard123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Security Unit",
        phoneNumber: "01710000009",
        photo: "https://randomuser.me/api/portraits/women/9.jpg",
      },
      {
        id: 10,
        category: "security",
        name: "Nurul Islam",
        email: "nurul.guard@kazifarms.com",
        password: "guard123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "Security Unit",
        phoneNumber: "01710000010",
        photo: "https://randomuser.me/api/portraits/men/10.jpg",
      },
       {
        id: 11,
        category: "employee",
        name: "Mister ABC",
        email: "abc@gmail.com",
        password: "123",
        companyName: "Kazi Farms Ltd.",
        organizationName: "IT Department",
        phoneNumber: "01710000004",
        photo: "",
      },
    ];

    localStorage.setItem("users", JSON.stringify(dummyUsers));
    console.log("✅ Dummy users stored in localStorage");
  }
};

export default setupDummyUsers;
