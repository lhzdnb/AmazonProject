import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

export const deliveryOptions = [
    {
        id: '1',
        deliveryDays: 7,
        priceCents: 0
    },
    {
        id: '2',
        deliveryDays: 3,
        priceCents: 499
    },
    {
        id: '3',
        deliveryDays: 1,
        priceCents: 999
    }
];

export function getDeliveryOption(deliveryOptionId) {
    let deliveryOption;
    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOptionId) {
            deliveryOption = option;
        }
    });

    return deliveryOption;
}

export function calculateDeliveryDate(deliveryOption) {
    const today = dayjs();
    let deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    while (deliveryDate.get('day') === 0 || deliveryDate.get('day') === 6) {
        deliveryDate = deliveryDate.add(1, 'day');
    }
    return deliveryDate.format('dddd, MMMM D');
}
