import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { EVENT_CATEGORIES } from "../../types/campus-event";
import type { EventFormData, EventFormErrors } from "../../types/campus-event";
import { validateEvent } from "../../utils/validate-event";

interface EventFormProps {
  initialData: EventFormData;
  submitText: string;
  onSubmit: (data: EventFormData) => void;
}

const fields = [
  { name: "title", label: "Etkinlik Adı", type: "text" },
  { name: "category", label: "Kategori", type: "select" },
  { name: "date", label: "Tarih", type: "date" },
  { name: "time", label: "Saat", type: "time" },
  { name: "location", label: "Yer", type: "text" },
  { name: "capacity", label: "Kontenjan", type: "number" },
  { name: "description", label: "Açıklama", type: "textarea" }
] as const;

function EventForm({ initialData, submitText, onSubmit }: EventFormProps) {
  const [data, setData] = useState<EventFormData>(initialData);
  const [errors, setErrors] = useState<EventFormErrors>({});

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setData((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validateEvent(data);
    setErrors(found);
    if (Object.keys(found).length === 0) {
      onSubmit(data);
    } else {
      const first = e.currentTarget.elements.namedItem(Object.keys(found)[0]);
      if (first instanceof HTMLElement) first.focus();
    }
  }

  return (
    <form className="form" noValidate onSubmit={handleSubmit}>
      {fields.map(({ name, label, type }) => {
        const props = {
          id: `event-${name}`,
          name,
          value: data[name],
          onChange: handleChange,
          "aria-invalid": errors[name] ? true as const : undefined,
          "aria-describedby": errors[name] ? `event-${name}-error` : undefined
        };
        return (
          <div className="form-alani" key={name}>
            <label htmlFor={props.id}>{label}</label>
            {type === "select" ? (
              <select {...props}>
                <option value="">Seçiniz</option>
                {EVENT_CATEGORIES.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            ) : type === "textarea" ? (
              <textarea {...props} rows={5} />
            ) : (
              <input {...props} type={type}
                maxLength={name === "title" ? 80 : undefined}
                min={name === "capacity" ? 1 : undefined}
                max={name === "capacity" ? 1000 : undefined}
                step={name === "capacity" ? 1 : undefined} />
            )}
            {errors[name] && <span id={`event-${name}-error`} className="hata-metni" role="alert">{errors[name]}</span>}
          </div>
        );
      })}
      <button className="buton" type="submit">{submitText}</button>
    </form>
  );
}

export default EventForm;
