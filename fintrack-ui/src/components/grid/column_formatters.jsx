

export function NumberFormatter({ value }) {
    return Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "PHP",
        maximumFractionDigits: 2,
    }).format(value);
}

