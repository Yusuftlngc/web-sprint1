interface EventFilterProps {
  searchText: string;
  category: string;
  categories: string[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

function EventFilter({
  searchText,
  category,
  categories,
  onSearchChange,
  onCategoryChange
}: EventFilterProps) {
  return (
    <div className="filtre">

      <div className="form-alani">
        <label htmlFor="search">
          Etkinlik ara
        </label>

        <input
          id="search"
          type="search"
          placeholder="Örn. atölye, kariyer"
          value={searchText}
          onChange={(e) =>
            onSearchChange(e.target.value)
          }
        />
      </div>


      <div className="form-alani">
        <label htmlFor="category">
          Kategori
        </label>

        <select
          id="category"
          value={category}
          onChange={(e) =>
            onCategoryChange(e.target.value)
          }
        >

          {categories.map((item) => (

            <option
              key={item}
              value={item}
            >
              {item}
            </option>

          ))}

        </select>
      </div>

    </div>
  );
}

export default EventFilter;