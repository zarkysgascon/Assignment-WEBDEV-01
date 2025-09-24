// Utility function
const $ = (id) => document.getElementById(id);

window.addEventListener("DOMContentLoaded", () => {
  const userData = sessionStorage.getItem("user");
  if (!userData) {

    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(userData);
  $("userName").textContent = user.firstname;
  $("userFullName").textContent = `${user.firstname} ${user.lastname}`;
  $("userEmail").textContent = user.email;
  $("userJoinDate").textContent = new Date(user.joinDate).toLocaleDateString();

  // ✅ Attach logout handler only after DOM is ready  
  const logoutBtn = $("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      sessionStorage.removeItem("user");
      window.location.href = "index.html"; // redirect to login if clicked the logout button
    });
  }
});

