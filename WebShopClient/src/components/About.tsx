import { FunctionComponent } from "react";

interface AboutProps {}

const About: FunctionComponent<AboutProps> = () => {
  return (
    <div className="container" style={{ textAlign: "left" }}>
      <header>
        <h1>User Guide for WebShop</h1>
      </header>

      <section id="introduction">
        <h2>Introduction</h2>
        <p>
          Welcome to WebShop, your one-stop online shopping destination. Our
          platform offers a seamless shopping experience with various features
          for both customers and administrators.
        </p>
      </section>

      <section id="general-guidelines">
        <h2>General Guidelines</h2>
        <h3>Navigation</h3>
        <ul>
          <li>
            <strong>Home:</strong> Browse and shop our products
          </li>
          <li>
            <strong>Store:</strong> View all available products
          </li>
          <li>
            <strong>Favorites:</strong> View and manage your favorite products
            (requires login)
          </li>
          <li>
            <strong>Cart:</strong> Manage your shopping cart (requires login)
          </li>
          <li>
            <strong>Sell to Us:</strong> Submit your products for consideration
          </li>
          <li>
            <strong>About Us:</strong> Learn more about our company
          </li>
          <li>
            <strong>Contact:</strong> Get in touch with our team
          </li>
        </ul>

        <h3>User Features</h3>
        <ul>
          <li>Browse and search products</li>
          <li>Add items to favorites (requires login)</li>
          <li>Add items to cart (requires login)</li>
          <li>Manage shopping cart (requires login)</li>
          <li>Submit products for sale</li>
          <li>Contact support</li>
        </ul>

        <h3>Login Requirements</h3>
        <p>The following features require you to be logged in:</p>
        <ul>
          <li>Adding items to favorites</li>
          <li>Managing favorites list</li>
          <li>Adding items to cart</li>
          <li>Managing shopping cart</li>
          <li>Checking out</li>
        </ul>
      </section>

      <section id="admin-features">
        <h2>Admin Features</h2>
        <p>Administrators have access to additional features:</p>
        <ul>
          <li>
            <strong>User Management:</strong> View and manage user accounts
          </li>
          <li>
            <strong>Statistics:</strong> Access system statistics and analytics
          </li>
          <li>
            <strong>Database Tasks:</strong> Perform administrative database
            operations
          </li>
          <li>
            <strong>Logo Management:</strong> Manage store logos and branding
          </li>
        </ul>
      </section>

      <section id="technical-stack">
        <h2>Technical Stack</h2>
        <p>This application is built using modern web technologies:</p>

        <h3>Frontend (Client)</h3>
        <ul>
          <li>React with TypeScript</li>
          <li>Vite for development and building</li>
          <li>Material UI (MUI) for UI components</li>
          <li>Bootstrap and React-Bootstrap for styling</li>
          <li>React Router for navigation</li>
          <li>Formik and Yup for form handling and validation</li>
          <li>Axios for API requests</li>
          <li>React Toastify for notifications</li>
          <li>SweetAlert2 for alerts</li>
          <li>React Spinners for loading states</li>
          <li>Font Awesome for icons</li>
          <li>Google Maps API integration</li>
        </ul>

        <h3>Backend (Server)</h3>
        <ul>
          <li>Node.js with Express</li>
          <li>MongoDB with Mongoose</li>
          <li>JWT for authentication</li>
          <li>Bcrypt for password hashing</li>
          <li>Joi for request validation</li>
          <li>CORS for cross-origin requests</li>
          <li>Morgan for HTTP request logging</li>
        </ul>
      </section>

      <footer>
        <p>
          For any questions or support, please use the Contact page to reach our
          team.
        </p>
      </footer>
    </div>
  );
};

export default About;
