import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trophy, Upload, ExternalLink } from 'lucide-react';
import { achievementFormSchema, AchievementFormData } from '../../schemas/achievementSchema';
import { dbService } from '../../services/storage/databaseService';
import { useAuth } from '../../contexts/AuthContext';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { Alert } from '../../components/common/Alert';

interface AchievementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  productTitle?: string;
  onSuccess: () => void;
}

export const AchievementFormModal: React.FC<AchievementFormModalProps> = ({
  isOpen,
  onClose,
  productId: defaultProductId,
  productTitle: defaultProductTitle,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableProducts = dbService.getProducts();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AchievementFormData>({
    resolver: zodResolver(achievementFormSchema),
    defaultValues: {
      productId: defaultProductId || '',
      title: '',
      category: 'Pertandingan Inovasi',
      eventName: '',
      organizer: '',
      recognitionLevel: 'Kebangsaan',
      resultType: 'Emas',
      achievementDate: new Date().toISOString().split('T')[0],
      achievementYear: new Date().getFullYear(),
      description: '',
      certificateUrl: '',
      referenceUrl: '',
    },
  });

  const onSubmit = async (data: AchievementFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      dbService.createAchievement(
        {
          ...data,
          productId: data.productId || defaultProductId || '',
        },
        user
      );
      reset();
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Ralat semasa menyimpan rekod pencapaian.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Daftar Pencapaian & Pengiktirafan Baharu"
      subtitle={defaultProductTitle ? `Produk: ${defaultProductTitle}` : 'Daftarkan rekod kejayaan atau anugerah produk'}
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {errorMsg && <Alert type="danger">{errorMsg}</Alert>}

        {!defaultProductId && (
          <div>
            <label className="label-base">
              Produk Inovasi Berkaitan <span className="text-rose-500">*</span>
            </label>
            <select className="input-base" {...register('productId')}>
              <option value="">-- Pilih Produk Inovasi --</option>
              {availableProducts.map((p) => (
                <option key={p.productId} value={p.productId}>
                  {p.archiveCode} - {p.title}
                </option>
              ))}
            </select>
            {errors.productId && <p className="text-xs text-rose-600 mt-1">{errors.productId.message}</p>}
          </div>
        )}

        <div>
          <label className="label-base">
            Tajuk Pencapaian / Anugerah <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="Contoh: Pingat Emas Kategori Inovasi Pembelajaran Digital"
            className="input-base"
            {...register('title')}
          />
          {errors.title && <p className="text-xs text-rose-600 mt-1">{errors.title.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label-base">
              Kategori Pencapaian <span className="text-rose-500">*</span>
            </label>
            <select className="input-base" {...register('category')}>
              <option value="Pertandingan Inovasi">Pertandingan Inovasi</option>
              <option value="Anugerah Institusi">Anugerah Institusi</option>
              <option value="Pengiktirafan Negeri">Pengiktirafan Negeri</option>
              <option value="Pengiktirafan Kebangsaan">Pengiktirafan Kebangsaan</option>
              <option value="Pengiktirafan Antarabangsa">Pengiktirafan Antarabangsa</option>
              <option value="Penerbitan">Penerbitan</option>
              <option value="Penggunaan dalam PdP">Penggunaan dalam PdP</option>
              <option value="Impak Pembelajaran">Impak Pembelajaran</option>
              <option value="Pengiktirafan Lain">Pengiktirafan Lain</option>
            </select>
          </div>

          <div>
            <label className="label-base">
              Peringkat Pengiktirafan <span className="text-rose-500">*</span>
            </label>
            <select className="input-base" {...register('recognitionLevel')}>
              <option value="Institusi">Institusi</option>
              <option value="Zon / Wilayah">Zon / Wilayah</option>
              <option value="Negeri">Negeri</option>
              <option value="Kebangsaan">Kebangsaan</option>
              <option value="Antarabangsa">Antarabangsa</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="label-base">
              Nama Program / Pertandingan <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: National Innovation Competition (i-CompEx)"
              className="input-base"
              {...register('eventName')}
            />
            {errors.eventName && <p className="text-xs text-rose-600 mt-1">{errors.eventName.message}</p>}
          </div>

          <div>
            <label className="label-base">
              Pihak Penganjur <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Contoh: JPPKK / Politeknik Malaysia"
              className="input-base"
              {...register('organizer')}
            />
            {errors.organizer && <p className="text-xs text-rose-600 mt-1">{errors.organizer.message}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="label-base">
              Keputusan / Anugerah <span className="text-rose-500">*</span>
            </label>
            <select className="input-base" {...register('resultType')}>
              <option value="Emas">Emas</option>
              <option value="Perak">Perak</option>
              <option value="Gangsa">Gangsa</option>
              <option value="Johan">Johan</option>
              <option value="Naib Johan">Naib Johan</option>
              <option value="Tempat Ketiga">Tempat Ketiga</option>
              <option value="Anugerah Khas">Anugerah Khas</option>
              <option value="Penghargaan">Penghargaan</option>
              <option value="Penyertaan">Penyertaan</option>
              <option value="Lain-lain">Lain-lain</option>
            </select>
          </div>

          <div>
            <label className="label-base">
              Tarikh Dicapai <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              className="input-base"
              {...register('achievementDate')}
            />
            {errors.achievementDate && <p className="text-xs text-rose-600 mt-1">{errors.achievementDate.message}</p>}
          </div>

          <div>
            <label className="label-base">
              Tahun Pencapaian <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              className="input-base"
              {...register('achievementYear', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div>
          <label className="label-base">
            Penerangan Ringkas Pencapaian <span className="text-rose-500">*</span>
          </label>
          <textarea
            rows={2}
            placeholder="Terangkan secara ringkas kriteria kejayaan, impak atau maklum balas juri..."
            className="input-base"
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-rose-600 mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="label-base">Pautan Rujukan Rasmi / Keputusan Penganjur (Pilihan)</label>
          <input
            type="text"
            placeholder="https://..."
            className="input-base"
            {...register('referenceUrl')}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" loading={isSubmitting} icon={<Trophy className="w-4 h-4" />}>
            Hantar untuk Pengesahan
          </Button>
        </div>
      </form>
    </Modal>
  );
};
