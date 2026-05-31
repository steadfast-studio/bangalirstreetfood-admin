interface EmailTemplateProps {
  bookingId: string;
  secretToken: string;
}

export function EmailTemplate({ bookingId, secretToken }: EmailTemplateProps) {
  return (
    <div>
      <h1>Congratulations, your booking is confirmed!</h1>
      <p>
        To check your booking details, please click the link below:
        <a
          href={`https://bangalirstreetfood.com/check?bookingId=${bookingId}&token=${secretToken}`}
          className="text-blue-500"
        >
          Check Your Booking
        </a>
      </p>
    </div>
  );
}
