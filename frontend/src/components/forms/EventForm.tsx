interface EventFormProps {
  title: string;
  onSubmit: () => void;
}

function EventForm({
  title,
  onSubmit
}: EventFormProps) {
  return (
    <>
      <p>
        Bu sprintte form sadece görünüm;
        kayıt yapılmaz.
      </p>

      <form
        className="form"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >

        <h2>{title}</h2>

        <label htmlFor="title">
          Etkinlik Adı
        </label>

        <input
          id="title"
          type="text"
          maxLength={80}
          placeholder="Örn. Kariyer Günleri 2026"
        />


        <label htmlFor="category">
          Kategori
        </label>

        <select id="category">
          <option value="">
            Seçiniz
          </option>

          <option value="Seminer">
            Seminer
          </option>

          <option value="Atölye">
            Atölye
          </option>

          <option value="Söyleşi">
            Söyleşi
          </option>

          <option value="Yarışma">
            Yarışma
          </option>
        </select>


        <label htmlFor="date">
          Tarih
        </label>

        <input
          id="date"
          type="date"
        />


        <label htmlFor="time">
          Saat
        </label>

        <input
          id="time"
          type="time"
        />


        <label htmlFor="location">
          Yer
        </label>

        <input
          id="location"
          type="text"
          placeholder="Örn. A Blok Konferans Salonu"
        />


        <label htmlFor="capacity">
          Kontenjan
        </label>

        <input
          id="capacity"
          type="number"
          min="1"
        />


        <label htmlFor="description">
          Açıklama
        </label>

        <textarea
          id="description"
          rows={5}
        />


        <button type="submit">
          Kaydet
        </button>

      </form>
    </>
  );
}

export default EventForm;