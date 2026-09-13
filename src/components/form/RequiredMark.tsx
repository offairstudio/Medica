/**
 * סימון שדה חובה לצד תווית השדה. הכוכבית מוסתרת מקוראי מסך -
 * הם מקבלים את המידע דרך aria-required על השדה עצמו - ומוסברת
 * בהערה אחת בראש הטופס (t.common.requiredNote).
 */
export function RequiredMark() {
  return (
    <span aria-hidden className="text-danger">
      {" *"}
    </span>
  );
}
