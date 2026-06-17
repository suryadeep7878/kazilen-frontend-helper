import { getCookie } from "@/utils/customCookie";

const BOOKING_BASE_URL = process.env.NEXT_PUBLIC_BOOKING_SERVICE_URL || "https://kazilen-prod-899213799870.asia-south1.run.app/api/helper";

/**
 * Shared helper for Booking Service (FastAPI) requests
 */
async function bookingFetch(endpoint, data = {}, method = "POST") {
    let token = null;
    if (typeof window !== "undefined") {
        token = getCookie("session_token");
    }

    const response = await fetch(`${BOOKING_BASE_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token && { "Authorization": `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || "Booking service error");
    }

    return response.json();
}

/**
 * Confirm a start-pin (Worker side)
 */
export async function confirmStartPin(customerPhone, workerPhone, pin, bookingId) {
    return bookingFetch("/confirm-start", {
        customer_phone: customerPhone,
        worker_phone: workerPhone,
        pin: pin,
        booking_id: bookingId
    });
}

/**
 * Confirm an end-pin (Worker side)
 */
export async function confirmEndPin(customerPhone, workerPhone, pin, bookingId) {
    return bookingFetch("/confirm-end", {
        customer_phone: customerPhone,
        worker_phone: workerPhone,
        pin: pin,
        booking_id: bookingId
    });
}
