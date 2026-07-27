import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { ALLERGENS } from '../data/presetMenus';

export default function DishFormModal({ isOpen, onClose, onSave, editingDish, defaultCategory }) {
  const [formData, setFormData] = useState({
    category: 'primeros',
    name: '',
    description: '',
    supplement: '0.00',
    isChefSpecial: false,
    isAvailable: true,
    allergens: []
  });

  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (editingDish) {
      setFormData({
        category: editingDish.category || 'primeros',
        name: editingDish.name || '',
        description: editingDish.description || '',
        supplement: editingDish.supplement || '0.00',
        isChefSpecial: !!editingDish.isChefSpecial,
        isAvailable: editingDish.isAvailable !== false,
        allergens: Array.isArray(editingDish.allergens) ? editingDish.allergens : []
      });
    } else {
      setFormData({
        category: defaultCategory || 'primeros',
        name: '',
        description: '',
        supplement: '0.00',
        isChefSpecial: false,
        isAvailable: true,
        allergens: []
      });
    }
    setValidationError('');
  }, [editingDish, defaultCategory, isOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleAllergen = (allergenId) => {
    setFormData(prev => {
      const current = Array.isArray(prev.allergens) ? prev.allergens : [];
      const exists = current.includes(allergenId);
      if (exists) {
        return { ...prev, allergens: current.filter(a => a !== allergenId) };
      } else {
        return { ...prev, allergens: [...current, allergenId] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setValidationError('Por favor escribe un nombre para el plato.');
      return;
    }

    // Validate supplement
    let parsedSupplement = parseFloat(formData.supplement);
    if (isNaN(parsedSupplement) || parsedSupplement < 0) {
      parsedSupplement = 0;
    }

    onSave({
      ...formData,
      name: trimmedName,
      description: formData.description.trim(),
      supplement: parsedSupplement > 0 ? parsedSupplement.toFixed(2) : '0.00'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
          <h2 className="font-bold text-base text-stone-900">
            {editingDish ? 'Editar Plato' : 'Añadir Plato'}
          </h2>
          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X className="w-4 h-4" />
          </button>
        </div>

        {validationError && (
          <div className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Categoría</label>
            <select
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className="form-select"
            >
              <option value="primeros">🥗 Primeros Platos</option>
              <option value="segundos">🥩 Segundos Platos</option>
              <option value="postres">🍰 Postres Caseros</option>
              <option value="bebidas">🍷 Bebidas & Sugerencias</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Nombre del Plato *</label>
            <input
              type="text"
              required
              placeholder="Ej: Lentejas caseras con chorizo"
              value={formData.name}
              onChange={e => {
                setFormData({ ...formData, name: e.target.value });
                if (validationError) setValidationError('');
              }}
              className="form-input font-medium"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción (Opcional)</label>
            <textarea
              rows="2"
              placeholder="Ej: Guisadas a fuego lento con verduritas de la huerta"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="form-group">
              <label className="form-label">Suplemento (€)</label>
              <input
                type="number"
                step="0.50"
                min="0"
                placeholder="0.00"
                value={formData.supplement}
                onChange={e => setFormData({ ...formData, supplement: e.target.value })}
                className="form-input"
              />
            </div>

            <div className="flex flex-col justify-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={formData.isChefSpecial}
                  onChange={e => setFormData({ ...formData, isChefSpecial: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span>Especialidad ⭐</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={e => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className={formData.isAvailable ? 'text-emerald-700' : 'text-red-600'}>
                  {formData.isAvailable ? '🟢 Disponible' : '🔴 Agotado'}
                </span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Alérgenos</label>
            <div className="grid grid-cols-3 gap-1.5">
              {ALLERGENS.map(allergen => {
                const selected = Array.isArray(formData.allergens) && formData.allergens.includes(allergen.id);
                return (
                  <button
                    key={allergen.id}
                    type="button"
                    onClick={() => toggleAllergen(allergen.id)}
                    className={`flex items-center gap-1 p-1.5 rounded text-xs border transition-all ${
                      selected
                        ? 'bg-stone-900 text-white font-bold border-stone-900'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <span>{allergen.icon}</span>
                    <span className="truncate">{allergen.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              <Save className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
