import { createRouter, createWebHistory } from "vue-router";

// Lazy load pages
const Landing = () => import("../pages/Landing.vue");
const Academy = () => import("../pages/Academy.vue");
const Treasure = () => import("../pages/Treasure.vue");
const Connect = () => import("../pages/Connect.vue");
const Hero = () => import("../pages/Hero.vue");
const Game = () => import("../pages/Game.vue");

const routes = [
  { path: "/", name: "Landing", component: Landing },
  { path: "/academy", name: "Academy", component: Academy },
  { path: "/treasure", name: "Treasure", component: Treasure },
  { path: "/connect", name: "Connect", component: Connect },
  { path: "/hero", name: "Hero", component: Hero },
  { path: "/game", name: "Game", component: Game, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      next({ path: "/connect" });
      return;
    }
  }
  next();
});

export default router;
