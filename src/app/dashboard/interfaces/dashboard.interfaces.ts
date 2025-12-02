// Dashboard-specific interfaces
export interface DashboardStats {
    totalStock: number;
    activeOrders: number;
    totalEmployees: number;
    completedOrders: number;
    pendingOrders: number;
    totalProducts: number;
}

export interface MovementSummary {
    entries: number;
    exits: number;
    balance: number;
    entriesChange: number;
    exitsChange: number;
}

export interface ActivityItem {
    type: 'movement' | 'order' | 'stock';
    timestamp: Date;
    description: string;
    icon: string;
    color: string;
}

export interface Alert {
    type: 'warning' | 'info' | 'success' | 'error';
    title: string;
    description: string;
    actionLabel?: string;
    actionRoute?: string;
}
