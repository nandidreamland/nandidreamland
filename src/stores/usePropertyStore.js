import { create } from 'zustand';

const PROPERTY_CACHE_TTL = 3 * 60 * 1000; // 3 minutes cache validity
const BANNER_CACHE_TTL = 15 * 60 * 1000; // 15 minutes cache validity

export const usePropertyStore = create((set, get) => ({
  properties: [],
  loading: false,
  error: null,
  lastFetched: null,

  // Admin portfolio state (includes pending, approved, and rejected listings)
  adminProperties: [],
  adminLoading: false,
  adminError: null,
  adminLastFetched: null,

  banners: [],
  bannersLoading: false,
  bannersLastFetched: null,

  // Set properties from SSR or initial payload
  setProperties: (initialProperties) => {
    if (Array.isArray(initialProperties) && initialProperties.length > 0) {
      set({
        properties: initialProperties,
        lastFetched: Date.now(),
        loading: false,
        error: null,
      });
    }
  },

  // Fetch properties for public/matching with smart TTL caching
  fetchProperties: async ({ force = false } = {}) => {
    const { properties, lastFetched, loading } = get();
    const isFresh = lastFetched && (Date.now() - lastFetched < PROPERTY_CACHE_TTL);

    // Return cached data if still fresh and not forced
    if (!force && isFresh && properties.length > 0) {
      return { success: true, data: properties, fromCache: true };
    }

    if (loading) return { success: true, data: properties, loading: true };

    set({ loading: true, error: null });

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('/api/properties', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        set({
          properties: data.data,
          lastFetched: Date.now(),
          loading: false,
          error: null,
        });
        return { success: true, data: data.data, fromCache: false };
      } else {
        throw new Error(data.message || 'Failed to load properties');
      }
    } catch (err) {
      console.error('Error fetching properties in store:', err);
      set({ loading: false, error: err.message });
      return { success: false, error: err.message, data: properties };
    }
  },

  // Fetch full property portfolio for Admin management (includes all statuses)
  fetchAdminProperties: async ({ force = false } = {}) => {
    const { adminProperties, adminLastFetched, adminLoading } = get();
    const isFresh = adminLastFetched && (Date.now() - adminLastFetched < PROPERTY_CACHE_TTL);

    if (!force && isFresh && adminProperties.length > 0) {
      return { success: true, data: adminProperties, fromCache: true };
    }

    if (adminLoading) return { success: true, data: adminProperties, loading: true };

    set({ adminLoading: true, adminError: null });

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const response = await fetch('/api/properties', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && Array.isArray(data.data)) {
        set({
          adminProperties: data.data,
          adminLastFetched: Date.now(),
          adminLoading: false,
          adminError: null,
        });
        return { success: true, data: data.data, fromCache: false };
      } else {
        throw new Error(data.message || 'Failed to load admin properties');
      }
    } catch (err) {
      console.error('Error fetching admin properties in store:', err);
      set({ adminLoading: false, adminError: err.message });
      return { success: false, error: err.message, data: adminProperties };
    }
  },

  // Fetch banners with caching
  fetchBanners: async ({ force = false } = {}) => {
    const { banners, bannersLastFetched } = get();
    const isFresh = bannersLastFetched && (Date.now() - bannersLastFetched < BANNER_CACHE_TTL);

    if (!force && isFresh && banners.length > 0) {
      return banners;
    }

    set({ bannersLoading: true });

    try {
      const sampleBanners = [
        {
          id: 1,
          image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=400&fit=crop&crop=center",
          title: "Luxury Apartments Available",
          subtitle: "Starting from ₹85L - Limited Time Offer",
          alt: "Luxury apartment complex",
          link: "/search?q=luxury+apartments"
        },
        {
          id: 2,
          image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&h=400&fit=crop&crop=center",
          title: "Premium Villas - Early Bird Offer",
          subtitle: "Save up to 15% on booking",
          alt: "Modern villa exterior",
          link: "/search?type=house"
        },
        {
          id: 3,
          image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&h=400&fit=crop&crop=center",
          title: "Ready to Move Properties",
          subtitle: "Immediate possession available",
          alt: "Ready to move apartment",
          link: "/search?q=ready+to+move"
        }
      ];

      set({
        banners: sampleBanners,
        bannersLastFetched: Date.now(),
        bannersLoading: false,
      });

      return sampleBanners;
    } catch (err) {
      console.error('Error fetching banners:', err);
      set({ bannersLoading: false });
      return banners;
    }
  },

  // Invalidate cache when mutations occur
  invalidateProperties: () => {
    set({ lastFetched: null, adminLastFetched: null });
  },

  invalidateAdminProperties: () => {
    set({ adminLastFetched: null });
  },

  // In-place optimistic updates across both admin and public property collections
  addProperty: (newProp) => {
    set((state) => ({
      adminProperties: [newProp, ...state.adminProperties],
      properties: newProp.status === 'approved' || !newProp.status
        ? [newProp, ...state.properties]
        : state.properties,
      lastFetched: Date.now(),
      adminLastFetched: Date.now(),
    }));
  },

  updateProperty: (id, updatedFields) => {
    set((state) => ({
      adminProperties: state.adminProperties.map((p) =>
        p._id === id ? { ...p, ...updatedFields } : p
      ),
      properties: state.properties.map((p) =>
        p._id === id ? { ...p, ...updatedFields } : p
      ),
    }));
  },

  removeProperty: (id) => {
    set((state) => ({
      adminProperties: state.adminProperties.filter((p) => p._id !== id),
      properties: state.properties.filter((p) => p._id !== id),
    }));
  },
}));
