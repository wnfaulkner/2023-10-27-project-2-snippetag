<% if (user) { %>
  <a href="/logout">LOG OUT</a>
<% } else { %>
  <a href="/auth/google">LOG IN</a>
<% } %>