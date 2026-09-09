import { createRouter, createWebHistory } from "vue-router";
import { supabase } from "../lib/supabase";
import { protectRoute } from "../lib/auth";

// Lazy load pages
const Landing = () => import("../pages/Landing.vue");
const Academy = () => import("../pages/Academy.vue");
const Treasury = () => import("../pages/Treasury.vue");
const Connect = () => import("../pages/Connect.vue");
const Characters = () => import("../pages/Characters.vue");
const Settings = () => import("../pages/Settings.vue");
const City = () => import("../pages/City.vue");
const World = () => import("../pages/World.vue");
const Web3 = () => import("../pages/Web3.vue");
const HowToPlay = () => import("../pages/HowToPlay.vue");
const About = () => import("../pages/About.vue");
const Zeraphiora = () => import("../pages/Zeraphiora.vue");
const Community = () => import("../pages/Community.vue");
const ResetPassword = () => import("../pages/ResetPassword.vue");
const Profile = () => import("../pages/Profile.vue");
const Market = () => import("../pages/Market.vue");
const Category = () => import("../components/market/Category.vue");
const ItemDetail = () => import("../components/market/ItemDetail.vue");

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/connect", name: "Connect", component: Connect },
  { path: "/web3", name: "Web3", component: Web3 },
  { path: "/how-to-play", name: "HowToPlay", component: HowToPlay },
  { path: "/about", name: "About", component: About },
  { path: "/market", name: "Market", component: Market },
  { path: "/Zeraphiora", name: "Zeraphiora", component: Zeraphiora },
  { path: "/community", name: "Community", component: Community },
  { path: "/academy", name: "Academy", component: Academy, meta: { requiresAuth: true } },
  { path: "/treasury", name: "Treasury", component: Treasury, meta: { requiresAuth: true } },
  { path: "/characters", name: "Characters", component: Characters, meta: { requiresAuth: true } },
  { path: "/city", name: "City", component: City, meta: { requiresAuth: true } },
  { path: "/world", name: "World", component: World, meta: { requiresAuth: true } },
  { path: "/settings", name: "Settings", component: Settings, meta: { requiresAuth: true } },
  { path: "/reset-password", name: "ResetPassword", component: ResetPassword },
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },
  { path: "/market/category/:slug", name: "Category", component: Category, props: true },
  { path: "/market/item/:id", name: "ItemDetail", component: ItemDetail, props: true }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => protectRoute(to, supabase));

export default router;
